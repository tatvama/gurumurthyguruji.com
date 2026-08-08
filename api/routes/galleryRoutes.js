import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN = requireRole("admin", "guruji", "superadmin");

const router = Router();

/* GET /api/gallery — public read, optional ?category= filter */
router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = `SELECT * FROM gallery_images WHERE 1=1`;
    const params = [];
    if (category) { params.push(category); query += ` AND category = $${params.length}`; }
    query += ` ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

/* POST /api/gallery — add a new image (admin) */
router.post("/", ALL_ADMIN, async (req, res, next) => {
  try {
    const { src, category, caption, caption_kn } = req.body;
    if (!src) return res.status(400).json({ success: false, message: "src is required." });
    const { rows } = await pool.query(
      `INSERT INTO gallery_images (src, category, caption, caption_kn, created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [src, category || "Guruji", caption || "", caption_kn || "", req.user?.name || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* DELETE /api/gallery/:id — remove an image (admin) */
router.delete("/:id", ALL_ADMIN, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(`DELETE FROM gallery_images WHERE id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ success: false, message: "Image not found." });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
