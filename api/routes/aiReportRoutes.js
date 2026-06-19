import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");

const router = Router();

/* ──────────────────────────────────────────────────────────────────────────
   AI Pre-Analysis (PRD §3 Stage 2, §12-B).
   Rule-based "Guruji Review Sheet" generator — structures intake, detects
   missing data, summarizes the issue and suggests questions. Designed so the
   draft can later be produced by an LLM without changing the API shape.
   It NEVER finalizes guidance — only assists (PRD §3 rule).
────────────────────────────────────────────────────────────────────────── */

function analyseCase(c, priorCases) {
  const missing = [];
  if (!c.tob)                              missing.push("Exact birth time (marked uncertain)");
  if (!c.pob || c.pob.trim().length < 3)   missing.push("Place of birth unclear");
  if (!c.dob)                              missing.push("Date of birth");
  if (!/^[0-9]{10}$/.test(c.mobile || "")) missing.push("Valid 10-digit phone number");
  if ((c.guidance_query || "").trim().length < 15) missing.push("Detailed problem description (statement too brief)");

  const category = c.problem_category || "unknown";
  const urgent = [];
  const q = (c.guidance_query || "").toLowerCase();
  if (/(emergenc|urgent|surgery|hospital|court|legal|wedding|marriage date)/.test(q))
    urgent.push("Time-sensitive matter detected in query");
  if (c.priority === "Urgent" || c.priority === "Emergency")
    urgent.push(`Case marked ${c.priority}`);

  const priorNote = priorCases.length
    ? `Previous consultation found: ${priorCases[0].case_reference} (${new Date(priorCases[0].created_at).toLocaleDateString("en-IN")}). Review continuity.`
    : "No previous consultation on record — new seeker.";

  const summary =
    `Devotee ${c.full_name} is seeking guidance regarding ${category !== "unknown" ? category : "a personal concern"}. ` +
    `${(c.guidance_query || "").trim().slice(0, 220)}${(c.guidance_query || "").length > 220 ? "…" : ""} ` +
    `Birth time is ${c.tob ? "provided" : "marked uncertain"}. ${priorNote}`;

  const questions = [
    "Confirm exact birth time and source (hospital record / family memory).",
    "Clarify the most pressing concern and desired timeline.",
    category === "marriage" ? "Any prior remedies or poojas already performed for this matter?"
                            : "Has any remedy been advised previously for this issue?",
    "Preferred mode and language for the consultation?",
  ];

  return {
    summary,
    missing_fields: missing.join(" • ") || "Intake data appears complete.",
    suggested_questions: questions.join("\n"),
    urgent_points: urgent.join(" • ") || "No urgent flags detected.",
    draft_report:
      `GURUJI REVIEW SHEET — ${c.case_reference}\n` +
      `Devotee: ${c.full_name}  |  ${c.mobile}\n` +
      `Service: ${c.service_type}  |  Category: ${category}  |  Priority: ${c.priority || "Normal"}\n\n` +
      `SUMMARY\n${summary}\n\n` +
      `MISSING / TO CONFIRM\n${missing.map(m => "• " + m).join("\n") || "• None"}\n\n` +
      `SUGGESTED QUESTIONS\n${questions.map(qq => "• " + qq).join("\n")}\n\n` +
      `[ AI DRAFT — NOT FINAL. For Guruji review only. ]`,
  };
}

/* GET /api/ai-reports/:caseRef — latest AI report for a case */
router.get("/:caseRef", ALL_ADMIN, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ai_reports WHERE case_reference = $1 ORDER BY created_at DESC LIMIT 1`,
      [req.params.caseRef]
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* POST /api/ai-reports/:caseRef/generate — run pre-analysis and store it */
router.post("/:caseRef/generate", ADMIN_SUPER, async (req, res) => {
  try {
    const { rows: cases } = await pool.query(
      `SELECT * FROM trikala_readings WHERE case_reference = $1`, [req.params.caseRef]
    );
    const c = cases[0];
    if (!c) return res.status(404).json({ success: false, message: "Case not found." });

    const prior = await pool.query(
      `SELECT case_reference, created_at FROM trikala_readings
       WHERE mobile = $1 AND case_reference <> $2 ORDER BY created_at DESC`,
      [c.mobile, c.case_reference]
    );

    const a = analyseCase(c, prior.rows);
    const { rows } = await pool.query(
      `INSERT INTO ai_reports (case_reference, summary, missing_fields, suggested_questions, draft_report, urgent_points, status)
       VALUES ($1,$2,$3,$4,$5,$6,'generated') RETURNING *`,
      [c.case_reference, a.summary, a.missing_fields, a.suggested_questions, a.draft_report, a.urgent_points]
    );

    // Advance status to "AI Draft Generated" if still at intake
    if (["Submitted", "Incomplete", "Ready for AI Analysis"].includes(c.status)) {
      await pool.query(
        `UPDATE trikala_readings SET status = 'AI Draft Generated', updated_at = NOW() WHERE id = $1`,
        [c.id]
      );
    }
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
