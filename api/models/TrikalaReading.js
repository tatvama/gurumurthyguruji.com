import { pool } from "../config/db.js";

const TrikalaReading = {
  async create({ case_reference, full_name, mobile, email, gender, occupation, dob, tob, pob, service_type, guidance_query }) {
    const { rows } = await pool.query(
      `INSERT INTO trikala_readings
         (case_reference, full_name, mobile, email, gender, occupation, dob, tob, pob, service_type, guidance_query)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [case_reference, full_name, mobile, email, gender, occupation, dob, tob || null, pob, service_type, guidance_query]
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
};

export default TrikalaReading;
