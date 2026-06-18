import { pool } from "../config/db.js";

/* ──────────────────────────────────────────────────────────────────────────
   Appointment notes — office / guruji / system / follow-up / cancellation /
   no-show / reschedule remarks attached to an appointment.
────────────────────────────────────────────────────────────────────────── */

export const NOTE_TYPES = [
  "office", "guruji", "system", "follow_up", "cancellation", "no_show", "reschedule",
];

const AppointmentNote = {
  async create({ appointment_id, devotee_id, note_type = "office", note_text, is_private = false, created_by }) {
    const type = NOTE_TYPES.includes(note_type) ? note_type : "office";
    const { rows } = await pool.query(
      `INSERT INTO appointment_notes
         (appointment_id, devotee_id, note_type, note_text, is_private, created_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [appointment_id, devotee_id || null, type, note_text, !!is_private, created_by || null]
    );
    return rows[0];
  },

  async listByAppointment(appointment_id) {
    const { rows } = await pool.query(
      `SELECT * FROM appointment_notes WHERE appointment_id = $1 ORDER BY created_at DESC, id DESC`,
      [appointment_id]
    );
    return rows;
  },
};

export default AppointmentNote;
