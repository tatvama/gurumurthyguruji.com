import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

/* ── Rule-based AI chat responder (PRD §4-C) ──────────────────────────
   Generates contextual replies from case data + AI report.
   Designed to be replaced with an LLM call — same API shape.
─────────────────────────────────────────────────────────────────────── */
async function buildAiReply(caseRef, userMessage) {
  const { rows } = await pool.query(
    `SELECT t.*, ar.summary, ar.missing_fields, ar.suggested_questions, ar.draft_report, ar.urgent_points
     FROM trikala_readings t
     LEFT JOIN LATERAL (
       SELECT * FROM ai_reports WHERE case_reference = t.case_reference ORDER BY created_at DESC LIMIT 1
     ) ar ON true
     WHERE t.case_reference = $1`,
    [caseRef]
  );
  if (!rows.length) return "Case not found.";
  const c = rows[0];
  const msg = userMessage.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("namaskar") || msg.includes("namaste")) {
    return `🙏 Namaskar! I am the Seva AI for case **${caseRef}** — ${c.full_name}.\n\nI can help you:\n• Summarize the case\n• Identify missing information\n• Suggest questions to ask the devotee\n• Flag urgency or sensitive points\n• Review Guruji's existing guidance\n• Draft status notes\n\nWhat would you like to know?`;
  }

  if (msg.includes("miss") || msg.includes("incomplete") || msg.includes("lacking")) {
    if (c.missing_fields) return `**Missing / To Confirm:**\n\n${c.missing_fields}`;
    const missing = [];
    if (!c.tob) missing.push("• Time of birth (exact) is not provided");
    if (!c.pob || c.pob.length < 3) missing.push("• Place of birth needs more detail (district/taluk)");
    if (!c.problem_category) missing.push("• Problem category is not yet tagged");
    if ((c.guidance_query || "").length < 30) missing.push("• Guidance query is too brief — request more detail");
    if (!missing.length) return "✅ No critical missing information detected for this case. All key fields are present.";
    return `**Missing information detected:**\n\n${missing.join("\n")}`;
  }

  if (msg.includes("summar") || msg.includes("brief") || msg.includes("overview") || msg.includes("tell me about")) {
    if (c.summary) return `**Case Summary:**\n\n${c.summary}`;
    const svc = c.service_type === "ashta_rekha" ? "Ashta Rekha Palm Reading" : "General Horoscope";
    return `**Case ${caseRef} — ${c.full_name}**\n\n` +
      `Service: ${svc}\nStatus: ${c.status}\nPriority: ${c.priority || "Normal"}\n` +
      `DOB: ${c.dob ? new Date(c.dob).toLocaleDateString("en-IN") : "—"}\n` +
      `TOB: ${c.tob || "Not provided"}\nPOB: ${c.pob}\n\n` +
      `**Query:** "${(c.guidance_query || "").slice(0, 300)}"${(c.guidance_query || "").length > 300 ? "…" : ""}`;
  }

  if (msg.includes("question") || msg.includes("ask") || msg.includes("clarif") || msg.includes("what to")) {
    if (c.suggested_questions) return `**Suggested questions to ask the devotee:**\n\n${c.suggested_questions}`;
    const q = [];
    if (!c.tob) q.push("1. What is the exact time of your birth? (hour and minute)");
    if (!c.pob || c.pob.length < 4) q.push("2. Which district/taluk were you born in?");
    q.push(`${q.length + 1}. How long have you been experiencing this situation?`);
    q.push(`${q.length + 1}. Is this affecting your career, family, health, or spiritual life primarily?`);
    q.push(`${q.length + 1}. Have you performed any puja or remedy for this before?`);
    q.push(`${q.length + 1}. Is there a specific timeline or deadline pressuring you?`);
    return `**Suggested questions:**\n\n${q.join("\n")}`;
  }

  if (msg.includes("urgent") || msg.includes("priority") || msg.includes("critical") || msg.includes("emergency")) {
    if (c.urgent_points && !c.urgent_points.includes("No urgent")) return `**⚡ Urgent Points:**\n\n${c.urgent_points}`;
    const urgentKeywords = ["cancer","accident","death","suicide","hospital","surgery","court case","jail","divorce","bankruptcy","abuse","violence"];
    const found = urgentKeywords.filter(k => (c.guidance_query || "").toLowerCase().includes(k));
    if (found.length) return `**⚡ Urgent flags detected:**\n\nKeywords: ${found.join(", ")}\n\nRecommend marking as **High priority** and advancing to "Awaiting Guruji Review" immediately.`;
    return `No urgent keywords found. Current priority: **${c.priority || "Normal"}**.\n\nStatus: ${c.status}`;
  }

  if (msg.includes("vakya") || msg.includes("guidance") || msg.includes("guruji") || msg.includes("remedy") || msg.includes("answer")) {
    if (c.guruji_observation) {
      return `**Existing Guruji Vakya:**\n\n**Observation:** ${c.guruji_observation}\n\n` +
        `**Karmic Indication:** ${c.karmic_indication || "Not set"}\n\n` +
        `**Divine Remedy:** ${c.divine_remedy || "Not set"}\n\n` +
        `**Duration:** ${c.remedy_duration || "—"} | **Place:** ${c.remedy_place || "—"}\n` +
        `**Mantra/Japa:** ${c.mantra_japa || "—"} | **Seva/Daana:** ${c.seva_daana || "—"}`;
    }
    if (c.draft_report) return `**AI Draft (for reference only — not final guidance):**\n\n${c.draft_report.slice(0, 600)}…\n\nPlease proceed to the **Guruji Vakya** tab to enter the final sacred guidance.`;
    return "No Guruji Vakya saved yet. Generate the AI Pre-Analysis first from the **Analysis** tab, then use the **Guruji Vakya** tab to enter the sacred guidance.";
  }

  if (msg.includes("status") || msg.includes("stage") || msg.includes("flow") || msg.includes("next step")) {
    const flow = ["Submitted","Incomplete","Ready for AI Analysis","AI Draft Generated","Awaiting Guruji Review","Under Review","Remedy Assigned","Follow-up Scheduled","Finalized","Published / Shared","Closed","Reopened"];
    const idx = flow.indexOf(c.status);
    const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
    return `**Current Status:** ${c.status}${next ? `\n**Next step:** ${next}` : " (final stage)"}\n\n**12-Stage Trikala Flow:**\n${flow.map((s, i) => `${i + 1}. ${s}${s === c.status ? " ← HERE" : ""}`).join("\n")}`;
  }

  if (msg.includes("devotee") || msg.includes("profile") || msg.includes("who is") || msg.includes("person")) {
    return `**Devotee Info:**\n\n**Name:** ${c.full_name}\n**Mobile:** ${c.mobile}\n**Email:** ${c.email}\n**Gender:** ${c.gender}\n**Occupation:** ${c.occupation}\n**Language:** ${c.preferred_language || "Not specified"}\n**Category:** ${c.problem_category || "Not tagged"}\n\nDevotee ID: ${c.devotee_id ? `#${c.devotee_id}` : "Not linked — run AI analysis to auto-link"}`;
  }

  /* Default contextual response */
  const svc = c.service_type === "ashta_rekha" ? "Ashta Rekha" : "Horoscope";
  return `For **${caseRef}** (${c.full_name} · ${svc} · ${c.status}):\n\n` +
    `${c.summary ? c.summary.slice(0, 250) + "…" : "No AI summary yet — generate from Analysis tab."}\n\n` +
    `You can ask me: *summarize, missing info, questions to ask, urgency, Guruji Vakya, status flow, devotee contact*.`;
}

/* GET /:caseRef — full chat history */
router.get("/:caseRef", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM chat_messages WHERE case_reference = $1 ORDER BY created_at ASC LIMIT 200`,
      [req.params.caseRef]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

/* POST /:caseRef — send message + get AI reply */
router.post("/:caseRef", async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: "Message content required" });

    const { rows: [userMsg] } = await pool.query(
      `INSERT INTO chat_messages (case_reference, role, content) VALUES ($1, 'user', $2) RETURNING *`,
      [req.params.caseRef, content.trim()]
    );

    const aiText = await buildAiReply(req.params.caseRef, content.trim());

    const { rows: [aiMsg] } = await pool.query(
      `INSERT INTO chat_messages (case_reference, role, content) VALUES ($1, 'assistant', $2) RETURNING *`,
      [req.params.caseRef, aiText]
    );

    res.json({ success: true, data: { userMessage: userMsg, aiMessage: aiMsg } });
  } catch (err) { next(err); }
});

/* DELETE /:caseRef — clear chat history */
router.delete("/:caseRef", async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM chat_messages WHERE case_reference = $1`, [req.params.caseRef]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
