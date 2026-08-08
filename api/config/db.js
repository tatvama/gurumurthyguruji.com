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

    /* Migrate legacy audience_bookings → appointment_bookings (one-time) */
    await client.query(`
      DO $$ BEGIN
        /* Case 1: only old table exists → rename cleanly */
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='audience_bookings')
        AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='appointment_bookings')
        THEN
          ALTER TABLE audience_bookings RENAME TO appointment_bookings;

        /* Case 2: both tables exist → copy rows then drop old */
        ELSIF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='audience_bookings')
          AND EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='appointment_bookings')
        THEN
          INSERT INTO appointment_bookings
            (id, full_name, mobile, profession, location, how_known, nearest_ashram, message, status, created_at)
          SELECT
            id, full_name, mobile, profession, location, how_known, nearest_ashram, message, status, created_at
          FROM audience_bookings
          ON CONFLICT (id) DO NOTHING;
          DROP TABLE audience_bookings;
        END IF;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS appointment_bookings (
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

    /* Add new columns to appointment_bookings if not present */
    await client.query(`ALTER TABLE appointment_bookings ADD COLUMN IF NOT EXISTS email VARCHAR(200);`);
    await client.query(`ALTER TABLE appointment_bookings ADD COLUMN IF NOT EXISTS city VARCHAR(120);`);
    await client.query(`ALTER TABLE appointment_bookings ADD COLUMN IF NOT EXISTS district VARCHAR(120);`);
    await client.query(`ALTER TABLE appointment_bookings ADD COLUMN IF NOT EXISTS state VARCHAR(120);`);
    await client.query(`ALTER TABLE appointment_bookings ADD COLUMN IF NOT EXISTS pincode VARCHAR(12);`);
    await client.query(`ALTER TABLE appointment_bookings ADD COLUMN IF NOT EXISTS devotee_id INTEGER;`);
    /* photo column removed from intake form — drop from existing databases */
    await client.query(`ALTER TABLE appointment_bookings DROP COLUMN IF EXISTS photo;`);

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

    /* ── Gallery images (admin-managed, public read) ──────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id          SERIAL PRIMARY KEY,
        src         TEXT         NOT NULL,
        category    VARCHAR(60)  NOT NULL DEFAULT 'Guruji',
        caption     VARCHAR(300) NOT NULL DEFAULT '',
        caption_kn  VARCHAR(300) NOT NULL DEFAULT '',
        created_by  VARCHAR(120),
        created_at  TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);`);

    /* ── Articles (admin-managed, public read) ─────────────────────── */
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id          SERIAL PRIMARY KEY,
        slug        VARCHAR(200) NOT NULL UNIQUE,
        category    VARCHAR(60)  NOT NULL DEFAULT 'Meditation',
        cover       TEXT         NOT NULL,
        title       VARCHAR(300) NOT NULL,
        title_kn    VARCHAR(300) NOT NULL DEFAULT '',
        excerpt     VARCHAR(500) NOT NULL DEFAULT '',
        excerpt_kn  VARCHAR(500) NOT NULL DEFAULT '',
        content     TEXT         NOT NULL,
        published   BOOLEAN      DEFAULT true,
        created_by  VARCHAR(120),
        created_at  TIMESTAMPTZ  DEFAULT NOW(),
        updated_at  TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);`);

    /* One-time seed so the public gallery/articles pages aren't empty on
       first switch-over from the old hardcoded data.ts — only runs while
       each table is still empty, safe to leave in permanently. */
    const { rows: [{ count: galleryCount }] } = await client.query(`SELECT COUNT(*)::int AS count FROM gallery_images;`);
    if (galleryCount === 0) {
      const seedImages = [
        ["/images/GuruJiHeroImg1.png", "Guruji", "Pujya Sri Gurumurthy Guruji in silent meditation", "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ಮೌನ ಧ್ಯಾನದಲ್ಲಿ"],
        ["/images/sanjivini_Hero_Img.png", "Sanjeevini Kriya", "A seeker in silent meditation at sunrise", "ಸೂರ್ಯೋದಯದಲ್ಲಿ ಮೌನ ಧ್ಯಾನದಲ್ಲಿ ಒಬ್ಬ ಸಾಧಕ"],
        ["/images/Sanjivini_L&P_Hero.png", "Sanjeevini Kriya", "The sacred path of Sanjeevini Kriya", "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಪವಿತ್ರ ಪಥ"],
        ["/ashramImg.png", "Ashrams", "Sadhguru Sai Samsthana Ashram at sunrise", "ಸೂರ್ಯೋದಯದಲ್ಲಿ ಸದ್ಗುರು ಸಾಯಿ ಸಂಸ್ಥಾನ ಆಶ್ರಮ"],
        ["/images/pranaShuddhiDeeksha.webp", "Deeksha", "Prana Shuddhi Deeksha — the seeker's first step", "ಪ್ರಾಣ ಶುದ್ಧಿ ದೀಕ್ಷೆ — ಸಾಧಕನ ಮೊದಲ ಹೆಜ್ಜೆ"],
        ["/images/atmaJagrutiDeeksha.webp", "Deeksha", "Atma Jagruti Deeksha — balance and depth", "ಆತ್ಮ ಜಾಗೃತಿ ದೀಕ್ಷೆ — ಸಮತೋಲನ ಮತ್ತು ಆಳ"],
        ["/images/divyaSamadhiDeeksha.webp", "Deeksha", "Divya Samadhi Deeksha — divine absorption", "ದಿವ್ಯ ಸಮಾಧಿ ದೀಕ್ಷೆ — ದಿವ್ಯ ಲೀನತೆ"],
        ["/images/guruji-meditating.png", "Guruji", "Guruji in deep meditation", "ಆಳ ಧ್ಯಾನದಲ್ಲಿ ಗುರೂಜಿ"],
        ["/images/guru-parampara-tree.jpg", "Guruji", "The unbroken Guru Parampara lineage", "ಅಖಂಡ ಗುರು ಪರಂಪರೆಯ ವಂಶಾವಳಿ"],
        ["/images/sadhguru_darshan_guruji_tumbnail-scaled.webp", "Guruji", "Seekers in darshan with Guruji", "ಗುರೂಜಿಯ ದರ್ಶನದಲ್ಲಿ ಸಾಧಕರು"],
        ["/images/basavana-betta-mountains.webp", "Ashrams", "Basavana Betta — the sacred hills", "ಬಸವನ ಬೆಟ್ಟ — ಪವಿತ್ರ ಗುಡ್ಡಗಳು"],
        ["/images/arshamCartImg.png", "Ashrams", "A quiet moment of devotion", "ಭಕ್ತಿಯ ಒಂದು ಶಾಂತ ಕ್ಷಣ"],
      ];
      for (const [src, category, caption, caption_kn] of seedImages) {
        await client.query(
          `INSERT INTO gallery_images (src, category, caption, caption_kn, created_by) VALUES ($1,$2,$3,$4,'seed')`,
          [src, category, caption, caption_kn]
        );
      }
    }

    const { rows: [{ count: articleCount }] } = await client.query(`SELECT COUNT(*)::int AS count FROM articles;`);
    if (articleCount === 0) {
      const seedArticles = [
        {
          slug: "silence-within-meditation-begins-with-stillness",
          category: "Meditation",
          cover: "/images/guruji-meditating.png",
          title: "The Silence Within: Why Meditation Begins With Stillness",
          title_kn: "ಆಂತರಿಕ ಮೌನ: ಧ್ಯಾನ ಸ್ಥಿರತೆಯಿಂದ ಏಕೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ",
          excerpt: "Before the mind can awaken, it must first learn to rest. A reflection on why stillness — not effort — is the true starting point of every meditative practice.",
          excerpt_kn: "ಮನಸ್ಸು ಜಾಗೃತವಾಗುವ ಮೊದಲು, ಅದು ಮೊದಲು ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು ಕಲಿಯಬೇಕು.",
          content: [
            "Most seekers begin their meditation practice searching for an experience — a light, a vision, a feeling of peace that announces itself. But the mind that searches is still a mind in motion, and motion cannot see itself clearly.",
            "Guruji often reminds seekers that silence is not the absence of thought, but the space in which thought is finally seen for what it is — passing, temporary, not the Self. The first sittings of any sadhana are rarely about achieving stillness; they are about noticing how rarely the mind is still at all.",
            "This is not a discouragement — it is the doorway. Every seeker who has walked the path of Sanjeevini Kriya begins exactly here, with the honest recognition of restlessness. From that recognition, and only from it, does true stillness begin to grow.",
            "Sit for a few minutes today with no goal other than to notice. Not to fix, not to force — simply to notice. That noticing, practiced gently and daily, is the seed of everything that follows.",
          ].join("\n\n"),
        },
        {
          slug: "understanding-sanjeevini-kriya-path-of-breath-and-grace",
          category: "Sanjeevini Kriya",
          cover: "/images/sanjivini_Hero_Img.png",
          title: "Understanding Sanjeevini Kriya: A Path of Breath and Grace",
          title_kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು: ಶ್ವಾಸ ಮತ್ತು ಕೃಪೆಯ ಪಥ",
          excerpt: "Sanjeevini Kriya asks for no outer change, only inner sincerity. A gentle introduction to what this practice is, and why it can be received by seekers of any background.",
          excerpt_kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ಯಾವುದೇ ಬಾಹ್ಯ ಬದಲಾವಣೆಯನ್ನು ಕೇಳುವುದಿಲ್ಲ, ಕೇವಲ ಆಂತರಿಕ ಪ್ರಾಮಾಣಿಕತೆಯನ್ನು ಮಾತ್ರ.",
          content: [
            "In the lineage of Mahavatar Babaji, Sanjeevini Kriya is offered not as a technique to be mastered through effort, but as a grace to be received through sincerity. It asks nothing of the seeker's outer life — no particular diet, no renunciation, no change of circumstance.",
            "What it asks for is a few honest minutes each day: a willingness to sit, to breathe with awareness, and to let the practice work quietly beneath the surface of daily life. Over time, seekers describe this as breath becoming prayer, and silence becoming strength.",
            "The path unfolds in stages — each a deeksha, a transmission received directly rather than learned from a book. This is why the guidance of a living master matters: Sanjeevini Kriya is a current of energy and grace as much as it is a technique of breath.",
            "If you feel drawn to begin, know that no prior experience is needed. Every seeker starts exactly where they are.",
          ].join("\n\n"),
        },
        {
          slug: "unbroken-lineage-kriya-yoga-babaji-to-today",
          category: "Guru Parampara",
          cover: "/images/guru-parampara-tree.jpg",
          title: "The Unbroken Lineage: Kriya Yoga From Babaji to Today",
          title_kn: "ಅಖಂಡ ಪರಂಪರೆ: ಬಾಬಾಜಿಯಿಂದ ಇಂದಿನವರೆಗೆ ಕ್ರಿಯಾ ಯೋಗ",
          excerpt: "From Mahavatar Babaji to Lahiri Mahasaya, Sri Yukteswar, and beyond — a look at how one unbroken chain of transmission carries Kriya Yoga's wisdom forward.",
          excerpt_kn: "ಮಹಾವತಾರ ಬಾಬಾಜಿಯಿಂದ ಇಂದಿನವರೆಗಿನ ಅಖಂಡ ಪ್ರಸರಣ ಸರಪಳಿಯ ನೋಟ.",
          content: [
            "A guru parampara is not a list of names — it is a living current, passed from one awakened being to the next, each carrying forward what was received without dilution.",
            "The chain begins, in this tradition, with Adi Guru Ishwara and the Saptarishis, moves through the Siddha tradition and Sage Agastya, and reaches the modern world through the deathless Mahavatar Babaji, who revived Kriya Yoga for this age.",
            "From Babaji, the transmission passed to Lahiri Mahasaya, the householder yogi who made Kriya accessible to ordinary seekers; to Sri Yukteswar, the Jñāna Avatar; and to Paramahansa Yogananda, who carried this light to the West.",
            "Today, that same current continues through Pujya Sri Gurumurthy Guruji — not as history to be studied, but as a living transmission still available to any sincere seeker who comes forward.",
          ].join("\n\n"),
        },
        {
          slug: "living-a-life-of-seva-quiet-power-of-selfless-service",
          category: "Seva",
          cover: "/ashramImg.png",
          title: "Living a Life of Seva: The Quiet Power of Selfless Service",
          title_kn: "ಸೇವಾಮಯ ಜೀವನ: ನಿಸ್ವಾರ್ಥ ಸೇವೆಯ ಮೌನ ಶಕ್ತಿ",
          excerpt: "Every day, Annadana feeds over a thousand people — not as charity, but as prayer. On why selfless service is treated as a spiritual practice in its own right.",
          excerpt_kn: "ಪ್ರತಿದಿನ, ಅನ್ನದಾನವು ಸಾವಿರಕ್ಕೂ ಹೆಚ್ಚು ಜನರಿಗೆ ಆಹಾರ ನೀಡುತ್ತದೆ.",
          content: [
            "It is easy to think of meditation and service as two separate paths — one turned inward, the other turned outward. But in this tradition, they are understood as one and the same practice, wearing different clothes.",
            "Seva asks the seeker to offer effort without attachment to the outcome, and without seeking recognition for it. Annadana — the daily feeding of those in need — is one of the clearest expressions of this: food offered simply because someone is hungry, with no question asked in return.",
            "Guruji often says that a mind trained in silent meditation but closed to another's suffering has not yet understood stillness at all. True inner peace naturally overflows into compassion for others.",
            "Whether through Annadana, through supporting an ashram's daily work, or through a small act of kindness in your own home, seva is available to every seeker, every day — no special qualification required, only willingness.",
          ].join("\n\n"),
        },
        {
          slug: "three-signs-you-are-ready-for-deeksha",
          category: "Deeksha",
          cover: "/images/pranaShuddhiDeeksha.webp",
          title: "Three Signs You Are Ready for Deeksha",
          title_kn: "ನೀವು ದೀಕ್ಷೆಗೆ ಸಿದ್ಧರಿದ್ದೀರಿ ಎಂಬುದರ ಮೂರು ಸೂಚನೆಗಳು",
          excerpt: "Deeksha is not earned through years of preparation — it is received through sincerity. Some gentle signs that a seeker is ready to take the next step.",
          excerpt_kn: "ದೀಕ್ಷೆಯನ್ನು ವರ್ಷಗಳ ಸಿದ್ಧತೆಯಿಂದ ಗಳಿಸಲಾಗುವುದಿಲ್ಲ.",
          content: [
            "Many seekers wait, believing they must first become 'ready' in some measurable way before approaching a Guru for deeksha. In truth, readiness rarely looks the way we expect.",
            "The first sign is simple honesty — an admission, even quietly to oneself, that the mind is restless and seeking something it cannot name. This honesty, not achievement, is the true starting point.",
            "The second sign is a longing for guidance rather than more information — a sense that reading and thinking alone have reached their limit, and that what is needed now is direct transmission from a living master.",
            "The third sign is simply the willingness to begin with just a few minutes a day. Deeksha does not ask for a transformed life in advance — it offers the very grace that makes transformation possible. If these signs feel familiar, the path is already open to you.",
          ].join("\n\n"),
        },
      ];
      for (const a of seedArticles) {
        await client.query(
          `INSERT INTO articles (slug, category, cover, title, title_kn, excerpt, excerpt_kn, content, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'seed')`,
          [a.slug, a.category, a.cover, a.title, a.title_kn, a.excerpt, a.excerpt_kn, a.content]
        );
      }
    }

    console.log("Database tables verified / created.");
  } finally {
    client.release();
  }
};

export { pool };
