import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN = requireRole("admin", "guruji", "superadmin");

const router = Router();

/* GET /api/case-pad/:caseRef */
router.get("/:caseRef", ALL_ADMIN, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT image_data FROM case_pad WHERE case_reference = $1",
      [req.params.caseRef]
    );
    res.json({ success: true, imageData: rows[0]?.image_data ?? null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* PUT /api/case-pad/:caseRef — upsert pad image */
router.put("/:caseRef", ALL_ADMIN, async (req, res) => {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ success: false, message: "imageData is required" });
  try {
    await pool.query(
      `INSERT INTO case_pad (case_reference, image_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (case_reference) DO UPDATE SET image_data = $2, updated_at = NOW()`,
      [req.params.caseRef, imageData]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE /api/case-pad/:caseRef — clear pad */
router.delete("/:caseRef", ALL_ADMIN, async (req, res) => {
  try {
    await pool.query("DELETE FROM case_pad WHERE case_reference = $1", [req.params.caseRef]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
