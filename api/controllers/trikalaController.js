import TrikalaReading from "../models/TrikalaReading.js";

/* ── Generate unique GURUJI-XXXXXXX case reference ─────────────── */
function generateCaseRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `GURUJI-${rand}`;
}

/* POST /api/trikala-readings — public form submission */
export const submitReading = async (req, res, next) => {
  try {
    const { fullName, mobile, email, gender, occupation, dob, tob, pob, serviceType, guidanceQuery } = req.body;

    // Ensure unique case reference (retry on unlikely collision)
    let caseReference;
    for (let i = 0; i < 5; i++) {
      caseReference = generateCaseRef();
      const existing = await TrikalaReading.findByCaseRef(caseReference);
      if (!existing) break;
    }

    const record = await TrikalaReading.create({
      case_reference: caseReference,
      full_name:      fullName,
      mobile,
      email,
      gender,
      occupation,
      dob,
      tob:            tob || null,
      pob,
      service_type:   serviceType,
      guidance_query: guidanceQuery,
    });

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

/* PATCH /api/trikala-readings/:id/status — admin status update */
export const updateReadingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ALLOWED = ["Submitted", "AI Report", "Under Review", "Finalized", "Published"];
    if (!ALLOWED.includes(status)) {
      return res.status(422).json({ success: false, message: `Status must be one of: ${ALLOWED.join(", ")}.` });
    }
    const record = await TrikalaReading.updateStatus(req.params.id, status);
    if (!record) return res.status(404).json({ success: false, message: "Reading not found." });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
