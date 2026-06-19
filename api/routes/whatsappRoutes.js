import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN = requireRole("admin", "guruji", "superadmin");

const router = Router();

/* ── PRD §10: WhatsApp message template builder ───────────────────── */
const TEMPLATES = {
  appointment_reminder: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nThis is a reminder for your appointment with Pujya Sri Gurumurthy Guruji.\n\n` +
    `📅 Date: ${d.date || "—"}\n⏰ Time: ${d.time || "—"}\n📍 ${d.location || "Guruji Ashram"}\n\n` +
    `Please arrive 15 minutes early. Bring any relevant documents.\n\n🕉️ Jay Guruji\n— Seva Team`,

  case_submitted: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour Trikala consultation request has been received.\n\n` +
    `📋 Case Ref: ${d.caseRef || "—"}\n📖 Service: ${d.serviceType || "Trikala"}\n\n` +
    `Guruji will personally review your request. We will contact you once the reading is ready.\n\n🕉️ Jay Guruji`,

  case_ready: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour Trikala consultation is ready.\n\n` +
    `📋 Case Ref: ${d.caseRef || "—"}\n\n` +
    `Pujya Guruji has personally reviewed your case and prepared the divine guidance. ` +
    `Please contact us to receive your consultation.\n\n🕉️ Jay Guruji`,

  remedy_assigned: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nDivine remedy has been assigned for your case.\n\n` +
    `💫 Remedy: ${d.remedy || "—"}\n⏱️ Duration: ${d.duration || "As advised"}\n` +
    `📍 Place: ${d.place || "As advised"}\n` +
    `${d.mantra ? `📿 Mantra: ${d.mantra}\n` : ""}` +
    `\nPlease follow the instructions with devotion and faith. Report back after completion.\n\n🕉️ Jay Guruji`,

  followup_reminder: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nThis is a follow-up from the Gurumurthy Guruji Seva team.\n\n` +
    `We wanted to check on your progress with the prescribed remedy/guidance.\n` +
    `${d.caseRef ? `\n📋 Case Ref: ${d.caseRef}` : ""}` +
    `\n\nPlease feel free to contact us with any questions or updates.\n\n🕉️ Jay Guruji`,

  welcome: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nWelcome to the divine service of Pujya Sri Gurumurthy Guruji.\n\n` +
    `You are now registered in our Devotee 360 system.\n` +
    `${d.devoteeRef ? `\n🆔 Devotee ID: ${d.devoteeRef}` : ""}` +
    `\n\nMay Guruji's blessings always be with you.\n\n🕉️ Jay Guruji\n— Seva Team`,

  intake_incomplete: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nWe noticed your Trikala case (${d.caseRef || "—"}) has some missing information.\n\n` +
    `📋 Missing: ${d.missing || "Time of birth / Place of birth"}\n\n` +
    `Please provide this information at the earliest so Guruji can review your case.\n\n🕉️ Jay Guruji`,

  no_show_followup: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nWe noticed you missed your appointment on ${d.date || "—"}.\n\n` +
    `Please contact us to reschedule. Guruji's time is sacred and limited.\n\n` +
    `📞 Call / WhatsApp to reschedule.\n\n🕉️ Jay Guruji`,
};

/* GET /templates — list available templates */
router.get("/templates", ALL_ADMIN, (_req, res) => {
  res.json({ success: true, data: Object.keys(TEMPLATES) });
});

/* POST /generate — generate message text from template */
router.post("/generate", ALL_ADMIN, (req, res) => {
  const { template, data } = req.body;
  if (!TEMPLATES[template]) {
    return res.status(400).json({
      success: false,
      message: `Unknown template. Available: ${Object.keys(TEMPLATES).join(", ")}`,
    });
  }
  try {
    const message = TEMPLATES[template](data || {});
    const phone = (data?.phone || "").replace(/\D/g, "").slice(-10);
    const waUrl = phone ? `https://wa.me/91${phone}?text=${encodeURIComponent(message)}` : null;
    res.json({ success: true, data: { message, waUrl } });
  } catch (_e) {
    res.status(500).json({ success: false, message: "Template rendering error" });
  }
});

/* POST /log — log a dispatched message */
router.post("/log", ALL_ADMIN, async (req, res, next) => {
  try {
    const { devotee_id, case_reference, phone, template, message } = req.body;
    await pool.query(
      `INSERT INTO whatsapp_log (devotee_id, case_reference, phone, template, message)
       VALUES ($1,$2,$3,$4,$5)`,
      [devotee_id || null, case_reference || null, phone || null, template || null, message || null]
    );
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
