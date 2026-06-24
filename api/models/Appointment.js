import { pool } from "../config/db.js";

/* ──────────────────────────────────────────────────────────────────────────
   Centralized Appointment Command Center (PRD §6)
   Manages ALL Guruji appointments — not only Trikala.
────────────────────────────────────────────────────────────────────────── */

const COLS = `id, appointment_ref, devotee_id, case_reference, booking_id, parent_appointment_id,
  devotee_name, mobile, appointment_type, mode, start_time, end_time, duration_minutes, status,
  priority, location, meeting_link, purpose, outcome_note, assigned_to,
  checked_in_at, checked_in_by, details_verified, members_count, arrival_photo_url,
  office_remarks, guruji_remarks, darshan_summary,
  scheduled_by, last_scheduled_at, schedule_attempt_count, reschedule_count, max_attempts,
  confirmed_at, confirmed_by, confirmation_method,
  reminder_sent_at, reminder_failed, reminder_failure_reason,
  darshan_started_at, completed_at, completed_by,
  cancelled_at, cancelled_by, cancellation_reason, cancellation_source,
  no_show_at, no_show_marked_by, no_show_reason,
  closed_at, closed_by, closed_reason, created_at, updated_at`;

/* Columns the workflow service / generic update may write */
const UPDATABLE = [
  "devotee_id","case_reference","booking_id","parent_appointment_id","devotee_name","mobile",
  "appointment_type","mode","start_time","end_time","duration_minutes","status",
  "priority","location","meeting_link","purpose","outcome_note","assigned_to",
  "checked_in_at","checked_in_by","details_verified","members_count","arrival_photo_url",
  "office_remarks","guruji_remarks","darshan_summary",
  "scheduled_by","last_scheduled_at","schedule_attempt_count","reschedule_count","max_attempts",
  "confirmed_at","confirmed_by","confirmation_method",
  "reminder_sent_at","reminder_failed","reminder_failure_reason",
  "darshan_started_at","completed_at","completed_by",
  "cancelled_at","cancelled_by","cancellation_reason","cancellation_source",
  "no_show_at","no_show_marked_by","no_show_reason",
  "closed_at","closed_by","closed_reason",
];

const Appointment = {
  async create(a) {
    const { rows } = await pool.query(
      `INSERT INTO appointments
         (devotee_id, case_reference, booking_id, parent_appointment_id, devotee_name, mobile,
          appointment_type, mode, start_time, end_time, duration_minutes, status, priority, location,
          meeting_link, purpose, assigned_to, schedule_attempt_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,COALESCE($12,'Requested'),
               COALESCE($13,'Normal'),$14,$15,$16,$17,$18)
       RETURNING ${COLS}`,
      [a.devotee_id || null, a.case_reference || null, a.booking_id || null, a.parent_appointment_id || null,
       a.devotee_name || null, a.mobile || null, a.appointment_type || "General Audience",
       a.mode || null, a.start_time || null, a.end_time || null, a.duration_minutes || null,
       a.status, a.priority, a.location || null, a.meeting_link || null,
       a.purpose || null, a.assigned_to || null,
       /* if created already scheduled with a slot, that counts as attempt 1 */
       (a.status === "Scheduled" && a.start_time) ? 1 : 0]
    );
    const created = rows[0];
    const year = new Date(created.created_at).getFullYear();
    const ref = `APT-${year}-${String(created.id).padStart(4, "0")}`;
    const { rows: upd } = await pool.query(
      `UPDATE appointments SET appointment_ref = $1 WHERE id = $2 RETURNING ${COLS}`,
      [ref, created.id]
    );
    return upd[0];
  },

  async findAll({ limit = 300, offset = 0, status, from, to } = {}) {
    const where = [];
    const params = [];
    if (status && status !== "all") { params.push(status); where.push(`status = $${params.length}`); }
    if (from) { params.push(from); where.push(`start_time >= $${params.length}`); }
    if (to)   { params.push(to);   where.push(`start_time <= $${params.length}`); }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    params.push(limit, offset);
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM appointments ${clause}
       ORDER BY start_time DESC NULLS LAST, created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(`SELECT ${COLS} FROM appointments WHERE id = $1`, [id]);
    return rows[0] || null;
  },

  async findByDevotee(devoteeId) {
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM appointments WHERE devotee_id = $1 ORDER BY start_time DESC NULLS LAST`,
      [devoteeId]
    );
    return rows;
  },

  /* Guruji darshan queue — devotees who are in today's darshan flow
     (Arrived / In Darshan / Completed), VIP/Urgent first then arrival order. */
  async findCheckedInToday() {
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM appointments
       WHERE checked_in_at::date = CURRENT_DATE
         AND status IN ('Arrived','In Darshan','Completed')
       ORDER BY
         CASE WHEN priority IN ('VIP','Urgent') THEN 0 ELSE 1 END,
         checked_in_at ASC`
    );
    return rows;
  },

  async update(id, a) {
    const fields = [];
    const params = [];
    const set = (c, v) => { params.push(v); fields.push(`${c} = $${params.length}`); };
    for (const k of UPDATABLE) if (k in a) set(k, a[k]);
    if (!fields.length) return this.findById(id);
    params.push(id);
    const { rows } = await pool.query(
      `UPDATE appointments SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${params.length} RETURNING ${COLS}`,
      params
    );
    return rows[0] || null;
  },

  async remove(id) {
    await pool.query(`DELETE FROM appointments WHERE id = $1`, [id]);
  },

  /* Today-dashboard counts (PRD §13) */
  async dashboardCounts() {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE start_time::date = CURRENT_DATE AND status NOT IN ('Cancelled','Closed')) AS today_count,
        COUNT(*) FILTER (WHERE status = 'Requested')                                         AS pending_approval,
        COUNT(*) FILTER (WHERE status = 'No-show' AND start_time::date = CURRENT_DATE - 1)   AS noshows_yesterday
      FROM appointments
    `);
    return rows[0];
  },
};

export default Appointment;
