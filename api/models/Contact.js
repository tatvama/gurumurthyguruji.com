import { pool } from "../config/db.js";

const Contact = {
  async create({ name, email, subject, message }) {
    const { rows } = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );
    return rows[0];
  },

  async findAll({ limit = 50, offset = 0 } = {}) {
    const { rows } = await pool.query(
      `SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM contacts WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },
};

export default Contact;
