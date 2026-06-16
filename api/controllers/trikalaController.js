import TrikalaReading from "../models/TrikalaReading.js";
import Devotee from "../models/Devotee.js";
import { logAudit } from "../utils/auditLog.js";
import { autoNotify } from "../utils/notifyWhatsApp.js";

/* The 12 PRD case statuses (§5) */
export const TRIKALA_STATUSES = [
  "Submitted", "Incomplete", "Ready for AI Analysis", "AI Draft Generated",
  "Awaiting Guruji Review", "Under Review", "Remedy Assigned", "Follow-up Scheduled",
  "Finalized", "Published / Shared", "Closed", "Reopened",
  // legacy values kept valid for existing rows
  "AI Report",
];

/* ── Generate unique GURUJI-XXXXXXX case reference ─────────────── */
function generateCaseRef() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits  = "0123456789";
  const parts = [
    ...Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * digits.length)]),
    ...Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]),
  ];
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]];
  }
  return parts.join("");
}

/* POST /api/trikala-readings — public form submission */
export const submitReading = async (req, res, next) => {
  try {
    const { fullName, mobile, whatsapp, email, gender, occupation, city, district, state, pincode, preferredLanguage, dob, tob, birthTimeAccuracy, pob, fatherName, motherName, spouseName, childrenDetails, serviceType, guidanceQuery, palmImage, problemCategory, priority, consent } = req.body;

    // Ensure unique case reference (retry on unlikely collision)
    let caseReference;
    for (let i = 0; i < 5; i++) {
      caseReference = generateCaseRef();
      const existing = await TrikalaReading.findByCaseRef(caseReference);
      if (!existing) break;
    }

    /* PRD §15 automation: find-or-create the Devotee 360 profile and link it */
    let devoteeId = null;
    try {
      const { devotee } = await Devotee.findOrCreateFrom({
        name: fullName, phone: mobile, email, city, district, state, pincode, language: preferredLanguage,
      });
      devoteeId = devotee.id;
    } catch (_e) { /* devotee linking is best-effort, never blocks intake */ }

    const record = await TrikalaReading.create({
      case_reference:     caseReference,
      full_name:          fullName,
      mobile,
      whatsapp:           whatsapp || null,
      email,
      gender,
      occupation,
      city:               city || null,
      district:           district || null,
      state:              state || null,
      pincode:            pincode || null,
      dob,
      tob:                tob || null,
      birth_time_accuracy: birthTimeAccuracy || null,
      pob,
      father_name:        fatherName || null,
      mother_name:        motherName || null,
      spouse_name:        spouseName || null,
      children_details:   childrenDetails || null,
      service_type:       serviceType,
      guidance_query:     guidanceQuery,
      palm_image:         palmImage || null,
      problem_category:   problemCategory || null,
      priority:           priority || "Normal",
      preferred_language: preferredLanguage || null,
      devotee_id:         devoteeId,
      consent:            consent || false,
    });

    if (devoteeId) {
      await Devotee.addTimeline(devoteeId, {
        event_type: "case_opened",
        title: `Trikala case opened: ${caseReference}`,
        description: (guidanceQuery || "").slice(0, 160),
        related_entity_type: "trikala_case", related_entity_id: caseReference, icon: "⭕",
      });
    }

    await logAudit({ action: "CREATE_TRIKALA_CASE", entityType: "trikala_case", entityId: caseReference, newValue: { fullName, serviceType, priority } });

    /* Auto-notify devotee on WhatsApp (best-effort, non-blocking) */
    autoNotify({
      template: "case_submitted",
      phone: mobile,
      name: fullName,
      data: { caseRef: caseReference, serviceType },
      devotee_id: devoteeId,
      case_reference: caseReference,
    }).catch(() => {});

    res.status(201).json({
      success:  true,
      message:  "Your Trikala Reading request has been submitted. Guruji will personally prepare your sacred reading.",
      data: {
        id:             record.id,
        caseReference:  record.case_reference,
        status:         record.status,
        createdAt:      record.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* GET /api/trikala-readings — admin list */
export const getAllReadings = async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit)  || 200, 500);
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status || undefined;
    const rows   = await TrikalaReading.findAll({ limit, offset, status });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

/* GET /api/trikala-readings/:id — single reading */
export const getReadingById = async (req, res, next) => {
  try {
    const record = await TrikalaReading.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Reading not found." });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

/* PATCH /api/trikala-readings/:id/status — admin status update (12 PRD statuses) */
export const updateReadingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!TRIKALA_STATUSES.includes(status)) {
      return res.status(422).json({ success: false, message: `Status must be one of: ${TRIKALA_STATUSES.join(", ")}.` });
    }
    const record = await TrikalaReading.updateStatus(req.params.id, status);
    if (!record) return res.status(404).json({ success: false, message: "Reading not found." });

    await logAudit({ action: "UPDATE_STATUS", entityType: "trikala_case", entityId: record.case_reference, newValue: status });

    /* Mirror milestone onto the devotee timeline */
    if (record.devotee_id && ["Published / Shared", "Closed", "Finalized"].includes(status)) {
      await Devotee.addTimeline(record.devotee_id, {
        event_type: "case_status",
        title: `Case ${record.case_reference}: ${status}`,
        related_entity_type: "trikala_case", related_entity_id: record.case_reference,
        icon: status === "Closed" ? "🔒" : "📄",
      });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

/* PATCH /api/trikala-readings/:id — update case fields (category, priority, devotee, assignment) */
export const updateReadingFields = async (req, res, next) => {
  try {
    const record = await TrikalaReading.update(req.params.id, req.body);
    if (!record) return res.status(404).json({ success: false, message: "Reading not found." });
    await logAudit({ action: "UPDATE_FIELDS", entityType: "trikala_case", entityId: record.case_reference, newValue: Object.keys(req.body) });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

/* PATCH /api/trikala-readings/:id/vakya — save Guruji Vakya / guidance (PRD §3 Stage 3) */
export const updateGurujiVakya = async (req, res, next) => {
  try {
    const {
      guruji_observation, karmic_indication, divine_remedy, remedy_duration,
      remedy_place, mantra_japa, seva_daana, followup_required, closure_note,
      guruji_reviewed_by, advanceStatus,
    } = req.body;

    const patch = {
      guruji_observation, karmic_indication, divine_remedy, remedy_duration,
      remedy_place, mantra_japa, seva_daana, followup_required, closure_note,
      guruji_reviewed_by, guruji_reviewed_at: new Date().toISOString(),
    };
    // When Guruji's guidance is saved, advance the case to "Remedy Assigned" by default
    if (advanceStatus !== false) patch.status = "Remedy Assigned";

    const record = await TrikalaReading.update(req.params.id, patch);
    if (!record) return res.status(404).json({ success: false, message: "Reading not found." });

    await logAudit({ action: "GURUJI_VAKYA_SAVED", entityType: "trikala_case", entityId: record.case_reference, newValue: { divine_remedy, guruji_reviewed_by } });

    // Mirror to devotee timeline — Guruji writes the remedy as free text (no pre-defined library)
    if (record.devotee_id) {
      await Devotee.addTimeline(record.devotee_id, {
        event_type: "guruji_guidance",
        title: "Guruji guidance added",
        description: divine_remedy || guruji_observation || "",
        related_entity_type: "trikala_case", related_entity_id: record.case_reference, icon: "🪔",
      });
    }

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
