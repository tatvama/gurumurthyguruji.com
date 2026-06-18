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

    /* Add palm_image column to existing trikala_readings if not present */
    await client.query(`
      ALTER TABLE trikala_readings
        ADD COLUMN IF NOT EXISTS palm_image TEXT;
    `);

    /* Add new columns to audience_bookings if not present */
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS email VARCHAR(200);`);
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS city VARCHAR(120);`);
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS district VARCHAR(120);`);
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS state VARCHAR(120);`);
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS pincode VARCHAR(12);`);
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS photo TEXT;`);
    await client.query(`ALTER TABLE audience_bookings ADD COLUMN IF NOT EXISTS devotee_id INTEGER;`);

    /* ════════════════════════════════════════════════════════════════════
       GURUJI SEVA MANAGEMENT SYSTEM — PRD core tables
       (devotees · remedies · appointments · timeline · ai · documents · audit)
    ════════════════════════════════════════════════════════════════════ */

    /* ── Devotee 360 master profile (PRD §7) ──────────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS devotees (
        id                SERIAL PRIMARY KEY,
        devotee_ref       VARCHAR(24)  UNIQUE,
        name              VARCHAR(160) NOT NULL,
        photo             TEXT,
        gender            VARCHAR(20),
        dob               DATE,
        phone             VARCHAR(20),
        whatsapp          VARCHAR(20),
        email             VARCHAR(200),
        city              VARCHAR(120),
        state             VARCHAR(120),
        country           VARCHAR(120) DEFAULT 'India',
        language          VARCHAR(40)  DEFAULT 'Kannada',
        relationship      VARCHAR(40)  DEFAULT 'new',
        tags              TEXT,
        associated_temple VARCHAR(160),
        seva_interest     VARCHAR(200),
        first_contact_at  TIMESTAMPTZ,
        family_links      TEXT,
        notes             TEXT,
        consent           BOOLEAN      DEFAULT false,
        sensitive         BOOLEAN      DEFAULT false,
        status            VARCHAR(20)  DEFAULT 'active',
        created_at        TIMESTAMPTZ  DEFAULT NOW(),
        updated_at        TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_devotees_phone ON devotees(phone);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_devotees_email ON devotees(email);`);
    /* Full address fields (Google Places auto-fill) */
    await client.query(`ALTER TABLE devotees ADD COLUMN IF NOT EXISTS district   VARCHAR(120);`);
    await client.query(`ALTER TABLE devotees ADD COLUMN IF NOT EXISTS pincode    VARCHAR(12);`);
    await client.query(`ALTER TABLE devotees ADD COLUMN IF NOT EXISTS profession VARCHAR(120);`);

    /* ── Divine Remedy library (PRD §3 Stage 4, §12-D) ────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS remedies (
        id                       SERIAL PRIMARY KEY,
        name                     VARCHAR(160) NOT NULL,
        category                 VARCHAR(60)  NOT NULL,
        default_instruction      TEXT,
        default_duration         VARCHAR(60),
        language                 VARCHAR(40)  DEFAULT 'Kannada',
        reminder_schedule        VARCHAR(120),
        followup_required        BOOLEAN      DEFAULT false,
        admin_caution            TEXT,
        guruji_approval_required BOOLEAN      DEFAULT false,
        active                   BOOLEAN      DEFAULT true,
        created_at               TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    /* ── Assigned remedies on a case (PRD §3 Stage 4) ─────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS case_remedies (
        id                 SERIAL PRIMARY KEY,
        case_reference     VARCHAR(24),
        devotee_id         INTEGER,
        remedy_id          INTEGER,
        remedy_name        VARCHAR(160),
        category           VARCHAR(60),
        custom_instruction TEXT,
        start_date         DATE,
        end_date           DATE,
        status             VARCHAR(30)  DEFAULT 'Assigned',
        completion_note    TEXT,
        proof_url          TEXT,
        admin_remarks      TEXT,
        guruji_remarks     TEXT,
        reminder_schedule  VARCHAR(120),
        created_at         TIMESTAMPTZ  DEFAULT NOW(),
        updated_at         TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    /* ── Centralized appointments (PRD §6) ────────────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id               SERIAL PRIMARY KEY,
        appointment_ref  VARCHAR(24) UNIQUE,
        devotee_id       INTEGER,
        case_reference   VARCHAR(24),
        booking_id       INTEGER,
        devotee_name     VARCHAR(160),
        mobile           VARCHAR(20),
        appointment_type VARCHAR(60),
        mode             VARCHAR(30),
        start_time       TIMESTAMPTZ,
        end_time         TIMESTAMPTZ,
        duration_minutes INTEGER,
        status           VARCHAR(30)  DEFAULT 'Requested',
        priority         VARCHAR(20)  DEFAULT 'Normal',
        location         VARCHAR(255),
        meeting_link     VARCHAR(255),
        purpose          TEXT,
        outcome_note     TEXT,
        assigned_to      VARCHAR(120),
        created_at       TIMESTAMPTZ  DEFAULT NOW(),
        updated_at       TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_time);`);

    /* ── Devotee arrival / check-in fields (office-staff verification before darshan) ── */
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS checked_in_at   TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS details_verified BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS office_remarks  TEXT;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guruji_remarks  TEXT;`);

    /* ── Appointment lifecycle / state-machine fields (Appointment Flow plan) ──────
       The full lead+visit record: scheduling attempt history, confirmation,
       reminder, darshan, cancellation, no-show and lead-closure metadata.
       start_time stays the canonical "scheduled time"; last_scheduled_at keeps
       the previous slot for reschedule history.                                    */
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS parent_appointment_id   INTEGER;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS scheduled_by            VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS last_scheduled_at       TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS schedule_attempt_count  INTEGER DEFAULT 0;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reschedule_count        INTEGER DEFAULT 0;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS max_attempts            INTEGER DEFAULT 3;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS confirmed_at            TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS confirmed_by            VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS confirmation_method     VARCHAR(50);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_sent_at        TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_failed         BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_failure_reason TEXT;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS checked_in_by           VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS members_count           INTEGER DEFAULT 1;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS arrival_photo_url        TEXT;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS darshan_started_at       TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS darshan_summary          TEXT;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS completed_at             TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS completed_by             VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_at             TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_by             VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason      TEXT;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_source      VARCHAR(50);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS no_show_at               TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS no_show_marked_by        VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS no_show_reason           TEXT;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS closed_at                TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS closed_by                VARCHAR(120);`);
    await client.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS closed_reason            TEXT;`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appointments_status   ON appointments(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appointments_devotee  ON appointments(devotee_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appointments_checkin  ON appointments(checked_in_at);`);

    /* ── Appointment timeline — everything that happened to a lead (Flow §16.2) ── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointment_timeline (
        id              SERIAL PRIMARY KEY,
        appointment_id  INTEGER NOT NULL,
        devotee_id      INTEGER,
        case_reference  VARCHAR(24),
        event_type      VARCHAR(60) NOT NULL,
        from_status     VARCHAR(40),
        to_status       VARCHAR(40),
        title           VARCHAR(255) NOT NULL,
        description     TEXT,
        metadata_json   JSONB,
        created_by      VARCHAR(120),
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appt_timeline_appt ON appointment_timeline(appointment_id);`);

    /* ── Appointment notes (office / guruji / system / follow-up …) (Flow §16.3) ── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointment_notes (
        id              SERIAL PRIMARY KEY,
        appointment_id  INTEGER NOT NULL,
        devotee_id      INTEGER,
        note_type       VARCHAR(50) NOT NULL DEFAULT 'office',
        note_text       TEXT NOT NULL,
        is_private      BOOLEAN DEFAULT false,
        created_by      VARCHAR(120),
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appt_notes_appt ON appointment_notes(appointment_id);`);

    /* ── Appointment check-in records — arrival verification snapshot (Flow §16.4) ── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointment_checkins (
        id               SERIAL PRIMARY KEY,
        appointment_id   INTEGER NOT NULL,
        devotee_id       INTEGER,
        photo_url        TEXT,
        members_count    INTEGER DEFAULT 1,
        member_names     JSONB,
        contact_verified BOOLEAN DEFAULT false,
        address_verified BOOLEAN DEFAULT false,
        details_verified BOOLEAN DEFAULT false,
        verified_name    VARCHAR(255),
        verified_phone   VARCHAR(30),
        verified_whatsapp VARCHAR(30),
        verified_email   VARCHAR(255),
        verified_city    VARCHAR(100),
        verified_district VARCHAR(100),
        verified_state   VARCHAR(100),
        verified_pincode VARCHAR(20),
        verified_address TEXT,
        office_remarks   TEXT,
        created_by       VARCHAR(120),
        created_at       TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_appt_checkins_appt ON appointment_checkins(appointment_id);`);

    /* ── Devotee 360 appointment-attention flag — highlight leads needing follow-up
          (cleared once the devotee reaches a Confirmed appointment) (Flow §15, §23) ── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS devotee_appointment_attention (
        id                       SERIAL PRIMARY KEY,
        devotee_id               INTEGER NOT NULL UNIQUE,
        appointment_id           INTEGER,
        attention_status         VARCHAR(100) NOT NULL,
        highlight_message        TEXT,
        requires_follow_up       BOOLEAN DEFAULT true,
        cleared_by_appointment_id INTEGER,
        cleared_at               TIMESTAMPTZ,
        created_at               TIMESTAMPTZ DEFAULT NOW(),
        updated_at               TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    /* ── Devotee chronological timeline (PRD §7) ──────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS devotee_timeline (
        id                  SERIAL PRIMARY KEY,
        devotee_id          INTEGER NOT NULL,
        event_type          VARCHAR(60),
        title               VARCHAR(255),
        description         TEXT,
        related_entity_type VARCHAR(40),
        related_entity_id   VARCHAR(40),
        icon                VARCHAR(16),
        created_at          TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_timeline_devotee ON devotee_timeline(devotee_id);`);

    /* ── AI pre-analysis reports (PRD §3 Stage 2) ─────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_reports (
        id                  SERIAL PRIMARY KEY,
        case_reference      VARCHAR(24),
        summary             TEXT,
        missing_fields      TEXT,
        suggested_questions TEXT,
        draft_report        TEXT,
        urgent_points       TEXT,
        status              VARCHAR(30)  DEFAULT 'draft',
        created_at          TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    /* ── Generated documents / PDFs (PRD §9) ──────────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id            SERIAL PRIMARY KEY,
        related_type  VARCHAR(40),
        related_id    VARCHAR(40),
        document_type VARCHAR(60),
        title         VARCHAR(200),
        file_url      TEXT,
        watermark     VARCHAR(60),
        status        VARCHAR(30)  DEFAULT 'draft',
        created_by    VARCHAR(120),
        created_at    TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    /* ── Audit log (PRD §11, §19) ─────────────────────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER,
        user_name   VARCHAR(120),
        action      VARCHAR(80),
        entity_type VARCHAR(40),
        entity_id   VARCHAR(40),
        old_value   TEXT,
        new_value   TEXT,
        created_at  TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    /* ── Extend trikala_readings into full case files (PRD §3, §5, §12) ─ */
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS devotee_id INTEGER;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS problem_category VARCHAR(40);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'Normal';`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(40);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS assigned_admin_id INTEGER;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS guruji_reviewed_by INTEGER;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS guruji_reviewed_at TIMESTAMPTZ;`);
    /* Guruji Vakya / Guidance (PRD §3 Stage 3 — most important section) */
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS guruji_observation TEXT;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS karmic_indication TEXT;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS divine_remedy TEXT;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS remedy_duration VARCHAR(60);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS remedy_place VARCHAR(160);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS mantra_japa TEXT;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS seva_daana TEXT;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS followup_required BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS closure_note TEXT;`);

    /* ── Enrich case_notes (PRD §4-B) ─────────────────────────────────── */
    await client.query(`ALTER TABLE case_notes ADD COLUMN IF NOT EXISTS note_type VARCHAR(40) DEFAULT 'Admin Note';`);
    await client.query(`ALTER TABLE case_notes ADD COLUMN IF NOT EXISTS author VARCHAR(120);`);
    await client.query(`ALTER TABLE case_notes ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'internal';`);
    await client.query(`ALTER TABLE case_notes ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false;`);

    /* ── Enrich case_followups (PRD §4-E) ─────────────────────────────── */
    await client.query(`ALTER TABLE case_followups ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Scheduled';`);
    await client.query(`ALTER TABLE case_followups ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(120);`);
    await client.query(`ALTER TABLE case_followups ADD COLUMN IF NOT EXISTS purpose VARCHAR(200);`);
    await client.query(`ALTER TABLE case_followups ADD COLUMN IF NOT EXISTS outcome TEXT;`);
    await client.query(`ALTER TABLE case_followups ADD COLUMN IF NOT EXISTS next_action VARCHAR(200);`);
    await client.query(`ALTER TABLE case_followups ADD COLUMN IF NOT EXISTS devotee_id INTEGER;`);

    /* ── Seed the Divine Remedy library (8 PRD remedy types) ──────────── */
    const { rows: remedyCount } = await client.query(`SELECT COUNT(*)::int AS n FROM remedies;`);
    if (remedyCount[0].n === 0) {
      await client.query(`
        INSERT INTO remedies (name, category, default_instruction, default_duration, followup_required, guruji_approval_required) VALUES
        ('Rudrabhisheka',        'Pooja',               'Perform Rudrabhisheka at a Shiva temple with devotion.',              '1 day',   true,  true),
        ('Ganapati Homa',        'Pooja',               'Perform Ganapati Homa to remove obstacles before new beginnings.',    '1 day',   false, true),
        ('Navagraha Archana',    'Pooja',               'Offer Navagraha Archana for planetary peace.',                        '1 day',   false, false),
        ('Daily Mantra Japa',    'Mantra',              'Chant the prescribed mantra daily with a clean mind, fixed count.',   '21 days', true,  false),
        ('Tuesday Vrata',        'Vrata',               'Observe fasting and prayer on Tuesdays as advised.',                  '11 weeks',true,  false),
        ('Kshetra Darshana',     'Temple Visit',        'Visit the specified sacred kshetra and offer prayers.',               '1 visit', false, false),
        ('Annadanam Seva',       'Daana',               'Offer food donation / annadanam to the needy.',                       'As advised', false, false),
        ('Go Seva',              'Seva',                'Feed and serve cows with care and devotion.',                         'As advised', false, false),
        ('Deepa Aradhana',       'Personal Discipline', 'Light a lamp daily at dusk and pray in silence.',                     '48 days', false, false),
        ('Review Consultation',  'Follow-up Consultation','Return for a review consultation after the remedy period.',         '1 session',true, true);
      `);
    }

    /* ── RBAC: widen role column for 8 PRD roles (PRD §11) ────────── */
    await client.query(`ALTER TABLE admin_users ALTER COLUMN role TYPE VARCHAR(40);`);
    /* ── Normalize legacy roles → 3-role system (superadmin, guruji, admin) ── */
    await client.query(`
      UPDATE admin_users
      SET role = 'admin'
      WHERE role NOT IN ('superadmin', 'guruji', 'admin');
    `);

    /* ── Per-case AI chat messages (PRD §4-C) ────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id             SERIAL PRIMARY KEY,
        case_reference VARCHAR(24) NOT NULL,
        role           VARCHAR(20) NOT NULL DEFAULT 'user',
        content        TEXT        NOT NULL,
        created_at     TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_chat_case ON chat_messages(case_reference);`);

    /* ── WhatsApp / reminder send log (PRD §10) ─────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_log (
        id             SERIAL PRIMARY KEY,
        devotee_id     INTEGER,
        case_reference VARCHAR(24),
        phone          VARCHAR(20),
        template       VARCHAR(60),
        message        TEXT,
        sent_at        TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    /* ── App-wide settings store (PRD §2, §10) ───────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key        VARCHAR(80) PRIMARY KEY,
        value      TEXT        NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    /* ── trikala_readings: birth accuracy + consent + whatsapp ── */
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS city VARCHAR(100);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS district VARCHAR(120);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS state VARCHAR(120);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS pincode VARCHAR(12);`);
    await client.query(`ALTER TABLE trikala_readings ADD COLUMN IF NOT EXISTS consent BOOLEAN DEFAULT false;`);
    /* ── drop columns removed from product ── */
    await client.query(`ALTER TABLE trikala_readings DROP COLUMN IF EXISTS birth_time_accuracy;`);
    await client.query(`ALTER TABLE trikala_readings DROP COLUMN IF EXISTS problem_category;`);
    /* ── drop family detail columns (removed from product) ── */
    await client.query(`ALTER TABLE trikala_readings DROP COLUMN IF EXISTS father_name;`);
    await client.query(`ALTER TABLE trikala_readings DROP COLUMN IF EXISTS mother_name;`);
    await client.query(`ALTER TABLE trikala_readings DROP COLUMN IF EXISTS spouse_name;`);
    await client.query(`ALTER TABLE trikala_readings DROP COLUMN IF EXISTS children_details;`);

    /* ── Booking comments / admin remarks (PRD §8) ──────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS booking_comments (
        id          SERIAL PRIMARY KEY,
        booking_id  INTEGER NOT NULL,
        text        TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT false,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_booking_comments_booking ON booking_comments(booking_id);`);

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
