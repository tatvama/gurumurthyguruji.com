import { pool } from "../config/db.js";

const AudienceBooking = {
  async create({ full_name, mobile, email, profession, city, district, state, location, how_known, nearest_ashram, message, photo }) {
    const { rows } = await pool.query(
      `INSERT INTO audience_bookings
         (full_name, mobile, email, profession, city, district, state, location, how_known, nearest_ashram, message, photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [full_name, mobile, email || null, profession, city || null, district || null, state || null,
       location || null, how_known, nearest_ashram, message || null, photo || null]
    );
    return rows[0];
  },

  async findAll({ limit = 50, offset = 0, status } = {}) {
    if (status) {
      const { rows } = await pool.query(
        `SELECT * FROM audience_bookings WHERE status = $1
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [status, limit, offset]
      );
      return rows;
    }
    const { rows } = await pool.query(
      `SELECT * FROM audience_bookings ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM audience_bookings WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE audience_bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  },
};

export default AudienceBooking;
