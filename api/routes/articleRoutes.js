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

/* Content is stored as one TEXT blob with paragraphs separated by a blank
   line ("\n\n") — kept as a single column instead of a JSON/array type to
   match this API's plain-column convention. Split/join happens at the
   edges (here, and in the frontend `content.split(...)`/`.join(...)`). */

/* GET /api/articles — public read, optional ?category= filter.
   Only published articles are returned to the public site. */
router.get("/", async (req, res, next) => {
  try {
    const { category, all } = req.query;
    let query = `SELECT * FROM articles WHERE 1=1`;
    const params = [];
    if (!all) query += ` AND published = true`;
    if (category) { params.push(category); query += ` AND category = $${params.length}`; }
    query += ` ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

/* POST /api/articles — create a new article (admin) */
router.post("/", ALL_ADMIN, async (req, res, next) => {
  try {
    const { title, title_kn, category, cover, excerpt, excerpt_kn, content, published } = req.body;
    if (!title || !cover || !content) {
      return res.status(400).json({ success: false, message: "title, cover and content are required." });
    }
    let slug = slugify(title);
    const existing = await pool.query(`SELECT 1 FROM articles WHERE slug = $1`, [slug]);
    if (existing.rowCount) slug = `${slug}-${Date.now().toString(36)}`;

    const { rows } = await pool.query(
      `INSERT INTO articles (slug, category, cover, title, title_kn, excerpt, excerpt_kn, content, published, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        slug,
        category || "Meditation",
        cover,
        title,
        title_kn || "",
        excerpt || "",
        excerpt_kn || "",
        content,
        published === false ? false : true,
        req.user?.name || null,
      ]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* PATCH /api/articles/:id — update fields (admin) */
router.patch("/:id", ALL_ADMIN, async (req, res, next) => {
  try {
    const fields = ["title", "title_kn", "category", "cover", "excerpt", "excerpt_kn", "content", "published"]
      .filter((k) => req.body[k] !== undefined);
    if (!fields.length) return res.status(400).json({ success: false, message: "No updatable fields." });
    const sets = fields.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const vals = fields.map((k) => req.body[k]);
    const { rows } = await pool.query(
      `UPDATE articles SET ${sets}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id, ...vals]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Article not found." });
    res.json({ success: true, data: rows[0] });
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
