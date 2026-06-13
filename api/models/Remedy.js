import { pool } from "../config/db.js";

/* ──────────────────────────────────────────────────────────────────────────
   Divine Remedy library + per-case remedy assignments (PRD §3 Stage 4, §12-D)
────────────────────────────────────────────────────────────────────────── */

const Remedy = {
  /* ── Library ───────────────────────────────────────────────────────── */
  async findAllLibrary({ category, activeOnly = false } = {}) {
    const where = [];
    const params = [];
    if (category && category !== "all") { params.push(category); where.push(`category = $${params.length}`); }
    if (activeOnly) where.push(`active = true`);
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const { rows } = await pool.query(
      `SELECT * FROM remedies ${clause} ORDER BY category, name`, params
    );
    return rows;
  },

  async createLibrary(r) {
    const { rows } = await pool.query(
      `INSERT INTO remedies
         (name, category, default_instruction, default_duration, language,
          reminder_schedule, followup_required, admin_caution, guruji_approval_required, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10,true)) RETURNING *`,
      [r.name, r.category, r.default_instruction || null, r.default_duration || null,
       r.language || "Kannada", r.reminder_schedule || null, r.followup_required ?? false,
       r.admin_caution || null, r.guruji_approval_required ?? false, r.active]
    );
    return rows[0];
  },

  async updateLibrary(id, r) {
    const fields = [];
    const params = [];
    const set = (c, v) => { params.push(v); fields.push(`${c} = $${params.length}`); };
    for (const k of ["name","category","default_instruction","default_duration","language",
      "reminder_schedule","followup_required","admin_caution","guruji_approval_required","active"])
      if (k in r) set(k, r[k]);
    if (!fields.length) { const { rows } = await pool.query(`SELECT * FROM remedies WHERE id=$1`, [id]); return rows[0]; }
    params.push(id);
    const { rows } = await pool.query(
      `UPDATE remedies SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *`, params
    );
    return rows[0] || null;
  },

  async deleteLibrary(id) {
    await pool.query(`DELETE FROM remedies WHERE id = $1`, [id]);
  },

  /* ── Case assignments ──────────────────────────────────────────────── */
  async assign(a) {
    const { rows } = await pool.query(
      `INSERT INTO case_remedies
         (case_reference, devotee_id, remedy_id, remedy_name, category, custom_instruction,
          start_date, end_date, status, admin_remarks, guruji_remarks, reminder_schedule)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,'Assigned'),$10,$11,$12)
       RETURNING *`,
      [a.case_reference || null, a.devotee_id || null, a.remedy_id || null,
       a.remedy_name, a.category || null, a.custom_instruction || null,
       a.start_date || null, a.end_date || null, a.status,
       a.admin_remarks || null, a.guruji_remarks || null, a.reminder_schedule || null]
    );
    return rows[0];
  },

  async findByCase(caseRef) {
    const { rows } = await pool.query(
      `SELECT * FROM case_remedies WHERE case_reference = $1 ORDER BY created_at DESC`, [caseRef]
    );
    return rows;
  },

  async findByDevotee(devoteeId) {
    const { rows } = await pool.query(
      `SELECT * FROM case_remedies WHERE devotee_id = $1 ORDER BY created_at DESC`, [devoteeId]
    );
    return rows;
  },

  async updateAssignment(id, a) {
    const fields = [];
    const params = [];
    const set = (c, v) => { params.push(v); fields.push(`${c} = $${params.length}`); };
    for (const k of ["custom_instruction","start_date","end_date","status","completion_note",
      "proof_url","admin_remarks","guruji_remarks","reminder_schedule"])
      if (k in a) set(k, a[k]);
    if (!fields.length) { const { rows } = await pool.query(`SELECT * FROM case_remedies WHERE id=$1`, [id]); return rows[0]; }
    params.push(id);
    const { rows } = await pool.query(
      `UPDATE case_remedies SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${params.length} RETURNING *`, params
    );
    return rows[0] || null;
  },

  async deleteAssignment(id) {
    await pool.query(`DELETE FROM case_remedies WHERE id = $1`, [id]);
  },
};

export default Remedy;
