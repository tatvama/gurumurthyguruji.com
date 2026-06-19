import { pool } from "../config/db.js";

/* Ensure allowed_sections column exists on startup */
pool.query(
  `ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS allowed_sections TEXT DEFAULT NULL`
).catch(() => {});

const AdminUser = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT id, name, mobile, role, status, last_login, created_at, allowed_sections
       FROM admin_users ORDER BY created_at ASC`
    );
    return rows;
  },

  async findByMobile(mobile) {
    const { rows } = await pool.query(
      `SELECT * FROM admin_users WHERE mobile = $1 LIMIT 1`,
      [mobile]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM admin_users WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, mobile, role }) {
    const { rows } = await pool.query(
      `INSERT INTO admin_users (name, mobile, role, password, status)
       VALUES ($1, $2, $3, '123456', 'active')
       RETURNING id, name, mobile, role, status, last_login, created_at, allowed_sections`,
      [name, mobile, role || "admin"]
    );
    return rows[0];
  },

  async update(id, { name, role, status, allowedSections }) {
    const sectionsVal = allowedSections != null ? JSON.stringify(allowedSections) : null;
    const { rows } = await pool.query(
      `UPDATE admin_users
       SET name=$1, role=$2, status=$3, allowed_sections=$4
       WHERE id=$5
       RETURNING id, name, mobile, role, status, last_login, created_at, allowed_sections`,
      [name, role, status, sectionsVal, id]
    );
    return rows[0] || null;
  },

  async updateLastLogin(id) {
    await pool.query(`UPDATE admin_users SET last_login = NOW() WHERE id = $1`, [id]);
  },

  async delete(id) {
    await pool.query(`DELETE FROM admin_users WHERE id = $1`, [id]);
  },
};

export default AdminUser;
