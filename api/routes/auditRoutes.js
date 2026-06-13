import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

/* GET /api/audit-logs — recent activity (PRD §11, §19) */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 300);
    const { rows } = await pool.query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1`, [limit]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* POST /api/audit-logs — record an action */
router.post("/", async (req, res) => {
  const { user_id, user_name, action, entity_type, entity_id, old_value, new_value } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, entity_type, entity_id, old_value, new_value)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id || null, user_name || null, action, entity_type || null,
       entity_id || null, old_value || null, new_value || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
