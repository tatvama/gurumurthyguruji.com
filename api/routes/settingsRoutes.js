import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const router = Router();

/* GET /api/settings — return all app settings as a flat object */
router.get("/", requireRole("admin", "guruji", "superadmin"), async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT key, value FROM app_settings`);
    const data = {};
    for (const r of rows) {
      try { data[r.key] = JSON.parse(r.value); } catch { data[r.key] = r.value; }
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

/* PATCH /api/settings — upsert one or more settings keys (superadmin only) */
router.patch("/", requireRole("superadmin"), async (req, res, next) => {
  try {
    const entries = Object.entries(req.body);
    if (!entries.length) return res.status(400).json({ success: false, message: "No settings provided." });
    for (const [key, value] of entries) {
      const serialised = typeof value === "string" ? value : JSON.stringify(value);
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, serialised]
      );
    }
    res.json({ success: true, message: "Settings saved." });
  } catch (err) { next(err); }
});

export default router;
