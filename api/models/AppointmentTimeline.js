import { pool } from "../config/db.js";

/* ──────────────────────────────────────────────────────────────────────────
   Appointment timeline — the full audit trail of everything that happened to
   an appointment lead (requested → scheduled → rescheduled → … → completed).
   The appointment STATUS shows the current stage; this shows the history.
────────────────────────────────────────────────────────────────────────── */

const AppointmentTimeline = {
  async create({ appointment_id, devotee_id, case_reference, event_type, from_status, to_status,
                 title, description, metadata_json, created_by }) {
    const { rows } = await pool.query(
      `INSERT INTO appointment_timeline
         (appointment_id, devotee_id, case_reference, event_type, from_status, to_status,
          title, description, metadata_json, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [appointment_id, devotee_id || null, case_reference || null, event_type,
       from_status || null, to_status || null, title, description || null,
       metadata_json ? JSON.stringify(metadata_json) : null, created_by || null]
    );
    return rows[0];
  },

  async listByAppointment(appointment_id) {
    const { rows } = await pool.query(
      `SELECT * FROM appointment_timeline WHERE appointment_id = $1 ORDER BY created_at ASC, id ASC`,
      [appointment_id]
    );
    return rows;
  },

  async listByDevotee(devotee_id) {
    const { rows } = await pool.query(
      `SELECT * FROM appointment_timeline WHERE devotee_id = $1 ORDER BY created_at DESC, id DESC`,
      [devotee_id]
    );
    return rows;
  },
};

export default AppointmentTimeline;
