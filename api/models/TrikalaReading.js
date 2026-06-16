import { pool } from "../config/db.js";

const TrikalaReading = {
  async create({ case_reference, full_name, mobile, whatsapp, email, gender, occupation, city, district, state, pincode, dob, tob, birth_time_accuracy, pob, father_name, mother_name, spouse_name, children_details, service_type, guidance_query, palm_image, problem_category, priority, preferred_language, devotee_id, consent }) {
    const { rows } = await pool.query(
      `INSERT INTO trikala_readings
         (case_reference, full_name, mobile, whatsapp, email, gender, occupation, city, district, state, pincode, dob, tob, birth_time_accuracy, pob,
          father_name, mother_name, spouse_name, children_details,
          service_type, guidance_query, palm_image, problem_category, priority, preferred_language, devotee_id, consent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
       RETURNING *`,
      [case_reference, full_name, mobile, whatsapp || null, email, gender, occupation, city || null,
       district || null, state || null, pincode || null,
       dob, tob || null, birth_time_accuracy || null, pob,
       father_name || null, mother_name || null, spouse_name || null, children_details || null,
       service_type, guidance_query, palm_image || null,
       problem_category || null, priority || "Normal", preferred_language || null, devotee_id || null, consent || false]
    );
    return rows[0];
  },

  async findAll({ limit = 200, offset = 0, status } = {}) {
    if (status) {
      const { rows } = await pool.query(
        `SELECT * FROM trikala_readings WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [status, limit, offset]
      );
      return rows;
    }
    const { rows } = await pool.query(
      `SELECT * FROM trikala_readings ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM trikala_readings WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByCaseRef(caseRef) {
    const { rows } = await pool.query(
      `SELECT * FROM trikala_readings WHERE case_reference = $1`,
      [caseRef]
    );
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE trikala_readings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  },

  /* Generic whitelisted update — case fields + Guruji Vakya (PRD §3 Stage 3) */
  async update(id, d) {
    const allowed = [
      "problem_category", "priority", "preferred_language", "assigned_admin_id",
      "devotee_id", "status",
      "guruji_observation", "karmic_indication", "divine_remedy", "remedy_duration",
      "remedy_place", "mantra_japa", "seva_daana", "followup_required", "closure_note",
      "guruji_reviewed_by", "guruji_reviewed_at",
    ];
    const fields = [];
    const params = [];
    const set = (c, v) => { params.push(v); fields.push(`${c} = $${params.length}`); };
    for (const k of allowed) if (k in d) set(k, d[k]);
    if (!fields.length) return this.findById(id);
    params.push(id);
    const { rows } = await pool.query(
      `UPDATE trikala_readings SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${params.length} RETURNING *`,
      params
    );
    return rows[0] || null;
  },
};

export default TrikalaReading;
