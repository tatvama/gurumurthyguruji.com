import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

/* GET /api/documents — list documents, optional ?related_type=&related_id= */
router.get("/", async (req, res, next) => {
  try {
    const { related_type, related_id } = req.query;
    let query = `SELECT * FROM documents WHERE 1=1`;
    const params = [];
    if (related_type) { params.push(related_type); query += ` AND related_type = $${params.length}`; }
    if (related_id)   { params.push(related_id);   query += ` AND related_id   = $${params.length}`; }
    query += ` ORDER BY created_at DESC LIMIT 200`;
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

/* GET /api/documents/:id */
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM documents WHERE id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Document not found." });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* POST /api/documents — create document record */
router.post("/", async (req, res, next) => {
  try {
    const { related_type, related_id, document_type, title, file_url, watermark, status, created_by } = req.body;
    if (!document_type) return res.status(400).json({ success: false, message: "document_type is required." });
    const { rows } = await pool.query(
      `INSERT INTO documents (related_type, related_id, document_type, title, file_url, watermark, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [related_type||null, related_id||null, document_type, title||null,
       file_url||null, watermark||null, status||"draft", created_by||null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* PATCH /api/documents/:id — update status / watermark */
router.patch("/:id", async (req, res, next) => {
  try {
    const fields = ["title","file_url","watermark","status","created_by"].filter(k => req.body[k] !== undefined);
    if (!fields.length) return res.status(400).json({ success: false, message: "No updatable fields." });
    const sets = fields.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const vals = fields.map(k => req.body[k]);
    const { rows } = await pool.query(
      `UPDATE documents SET ${sets} WHERE id = $1 RETURNING *`,
      [req.params.id, ...vals]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Document not found." });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

/* DELETE /api/documents/:id */
router.delete("/:id", async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM documents WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
