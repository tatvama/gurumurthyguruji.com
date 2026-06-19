import { pool } from "../config/db.js";

const AppointmentBooking = {
  async create({ full_name, mobile, email, profession, city, district, state, pincode, location, how_known, nearest_ashram, message }) {
    const { rows } = await pool.query(
      `INSERT INTO appointment_bookings
         (full_name, mobile, email, profession, city, district, state, pincode, location, how_known, nearest_ashram, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [full_name, mobile, email || null, profession, city || null, district || null, state || null, pincode || null,
       location || null, how_known, nearest_ashram, message || null]
    );
    return rows[0];
  },

  async findAll({ limit = 50, offset = 0, status } = {}) {
    if (status) {
      const { rows } = await pool.query(
        `SELECT * FROM appointment_bookings WHERE status = $1
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [status, limit, offset]
      );
      return rows;
    }
    const { rows } = await pool.query(
      `SELECT * FROM appointment_bookings ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM appointment_bookings WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE appointment_bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  },
};

export default AppointmentBooking;
