import { pool } from "../config/db.js";

/* ──────────────────────────────────────────────────────────────────────────
   Devotee 360 appointment-attention flag (Appointment Flow §15, §23).
   When a lead is closed / cancelled / no-showed and follow-up is required,
   the devotee is highlighted in Devotee 360. The highlight is cleared once
   the same devotee reaches a Confirmed appointment again.
   One active row per devotee (UNIQUE devotee_id) — upserted.
────────────────────────────────────────────────────────────────────────── */

export const ATTENTION_STATUSES = [
  "active_requested", "scheduled", "needs_follow_up", "closed_without_darshan",
  "cancelled_follow_up_required", "no_show_follow_up_required", "completed", "cleared",
];

const DevoteeAttention = {
  /* Raise / replace the attention flag for a devotee */
  async set({ devotee_id, appointment_id, attention_status, highlight_message, requires_follow_up = true }) {
    if (!devotee_id) return null;
    const { rows } = await pool.query(
      `INSERT INTO devotee_appointment_attention
         (devotee_id, appointment_id, attention_status, highlight_message, requires_follow_up,
          cleared_by_appointment_id, cleared_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NULL,NULL,NOW())
       ON CONFLICT (devotee_id) DO UPDATE SET
         appointment_id            = EXCLUDED.appointment_id,
         attention_status          = EXCLUDED.attention_status,
         highlight_message         = EXCLUDED.highlight_message,
         requires_follow_up        = EXCLUDED.requires_follow_up,
         cleared_by_appointment_id = NULL,
         cleared_at                = NULL,
         updated_at                = NOW()
       RETURNING *`,
      [devotee_id, appointment_id || null, attention_status, highlight_message || null, !!requires_follow_up]
    );
    return rows[0];
  },

  /* Clear the highlight once a new appointment is confirmed */
  async clear({ devotee_id, cleared_by_appointment_id }) {
    if (!devotee_id) return null;
    const { rows } = await pool.query(
      `UPDATE devotee_appointment_attention
         SET attention_status = 'cleared', requires_follow_up = false,
             cleared_by_appointment_id = $2, cleared_at = NOW(), updated_at = NOW()
       WHERE devotee_id = $1 AND requires_follow_up = true
       RETURNING *`,
      [devotee_id, cleared_by_appointment_id || null]
    );
    return rows[0] || null;
  },

  async getByDevotee(devotee_id) {
    if (!devotee_id) return null;
    const { rows } = await pool.query(
      `SELECT * FROM devotee_appointment_attention WHERE devotee_id = $1`,
      [devotee_id]
    );
    return rows[0] || null;
  },

  /* All devotees currently flagged for follow-up (for an admin worklist) */
  async listActive() {
    const { rows } = await pool.query(
      `SELECT * FROM devotee_appointment_attention
       WHERE requires_follow_up = true ORDER BY updated_at DESC`
    );
    return rows;
  },
};

export default DevoteeAttention;
