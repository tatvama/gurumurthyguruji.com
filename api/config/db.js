import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

export const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(200) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS audience_bookings (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        profession VARCHAR(120) NOT NULL,
        location VARCHAR(255) NOT NULL,
        how_known VARCHAR(255) NOT NULL,
        nearest_ashram VARCHAR(255) NOT NULL,
        message TEXT,
        status VARCHAR(30) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        mobile VARCHAR(20) NOT NULL UNIQUE,
        role VARCHAR(20) NOT NULL DEFAULT 'admin',
        password VARCHAR(100) NOT NULL DEFAULT '123456',
        sections_count INTEGER DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS trikala_readings (
        id              SERIAL PRIMARY KEY,
        case_reference  VARCHAR(20)  NOT NULL UNIQUE,
        full_name       VARCHAR(120) NOT NULL,
        mobile          VARCHAR(20)  NOT NULL,
        email           VARCHAR(200) NOT NULL,
        gender          VARCHAR(20)  NOT NULL,
        occupation      VARCHAR(120) NOT NULL,
        dob             DATE         NOT NULL,
        tob             TIME,
        pob             VARCHAR(255) NOT NULL,
        service_type    VARCHAR(50)  NOT NULL,
        guidance_query  TEXT         NOT NULL,
        status          VARCHAR(30)  NOT NULL DEFAULT 'Submitted',
        created_at      TIMESTAMPTZ  DEFAULT NOW(),
        updated_at      TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS case_notes (
        id             SERIAL PRIMARY KEY,
        case_reference VARCHAR(20)  NOT NULL,
        text           TEXT         NOT NULL,
        created_at     TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS case_followups (
        id             SERIAL PRIMARY KEY,
        case_reference VARCHAR(20)  NOT NULL,
        type           VARCHAR(30)  NOT NULL,
        date_time      TIMESTAMPTZ  NOT NULL,
        notes          TEXT         DEFAULT '',
        created_at     TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS case_pad (
        id             SERIAL PRIMARY KEY,
        case_reference VARCHAR(20)  NOT NULL UNIQUE,
        image_data     TEXT         NOT NULL,
        updated_at     TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    /* Seed the default super admin if not exists */
    await client.query(`
      INSERT INTO admin_users (name, mobile, role, password, sections_count, status)
      VALUES ('Super Admin', '9999999999', 'superadmin', '123456', 0, 'active')
      ON CONFLICT (mobile) DO NOTHING;
    `);

    console.log("Database tables verified / created.");
  } finally {
    client.release();
  }
};

export { pool };
