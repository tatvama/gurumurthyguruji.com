import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN = requireRole("admin", "guruji", "superadmin");

const router = Router();

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 180);
}

/* GET /api/articles — public read (published only) by default.
   Pass ?all=true (admin dashboard) to see every status. Optional
   ?category=&status= filters. */
router.get("/", async (req, res, next) => {
  try {
    const { category, status, all } = req.query;
    let query = `SELECT * FROM articles WHERE 1=1`;
    const params = [];
    if (!all) {
      query += ` AND status = 'published'`;
    } else if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (category) { params.push(category); query += ` AND category = $${params.length}`; }
    query += ` ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

/* POST /api/articles — create a new article (admin) */
router.post("/", ALL_ADMIN, async (req, res, next) => {
  try {
    const {
      title, title_kn, category, cover, excerpt, excerpt_kn, content,
      status, tags, author, meta_title, meta_description,
    } = req.body;
    if (!title || !cover || !content) {
      return res.status(400).json({ success: false, message: "title, cover and content are required." });
    }
    let slug = slugify(title);
    const existing = await pool.query(`SELECT 1 FROM articles WHERE slug = $1`, [slug]);
    if (existing.rowCount) slug = `${slug}-${Date.now().toString(36)}`;

    const finalStatus = status || "draft";
    const { rows } = await pool.query(
      `INSERT INTO articles
         (slug, category, cover, title, title_kn, excerpt, excerpt_kn, content,
          published, status, tags, author, meta_title, meta_description, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        slug,
        category || "Meditation",
        cover,
        title,
        title_kn || "",
        excerpt || "",
        excerpt_kn || "",
        content,
        finalStatus === "published",
        finalStatus,
        JSON.stringify(Array.isArray(tags) ? tags : []),
        author || req.user?.name || "",
        meta_title || "",
        meta_description || "",
        req.user?.name || null,
      ]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* PATCH /api/articles/:id — update fields (admin) */
router.patch("/:id", ALL_ADMIN, async (req, res, next) => {
  try {
    const allowed = [
      "title", "title_kn", "category", "cover", "excerpt", "excerpt_kn",
      "content", "status", "tags", "author", "meta_title", "meta_description",
    ];
    const fields = allowed.filter((k) => req.body[k] !== undefined);
    if (!fields.length) return res.status(400).json({ success: false, message: "No updatable fields." });

    const sets = [];
    const vals = [];
    let i = 2;
    for (const k of fields) {
      sets.push(`${k} = $${i}`);
      vals.push(k === "tags" ? JSON.stringify(req.body[k] || []) : req.body[k]);
      i++;
    }
    // Keep the legacy `published` boolean in sync whenever status changes.
    if (req.body.status !== undefined) {
      sets.push(`published = $${i}`);
      vals.push(req.body.status === "published");
      i++;
    }

    const { rows } = await pool.query(
      `UPDATE articles SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id, ...vals]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Article not found." });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* POST /api/articles/view — public, increments the view counter.
   Uses a body param (not /:id) so it can stay in the exact-path
   PUBLIC_ROUTES allow-list. */
router.post("/view", async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "id is required." });
    await pool.query(`UPDATE articles SET views = views + 1 WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

/* DELETE /api/articles/:id — remove an article (admin) */
router.delete("/:id", ALL_ADMIN, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(`DELETE FROM articles WHERE id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ success: false, message: "Article not found." });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
