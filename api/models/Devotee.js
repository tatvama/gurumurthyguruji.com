import { pool } from "../config/db.js";

/* ──────────────────────────────────────────────────────────────────────────
   Devotee 360 — the central profile every booking, case, appointment,
   remedy, follow-up and timeline event links back to (PRD §1, §7).
────────────────────────────────────────────────────────────────────────── */

const COLS = `id, devotee_ref, name, photo, gender, dob, phone, whatsapp, email,
  city, district, state, pincode, country, language, profession, relationship, tags, associated_temple,
  seva_interest, first_contact_at, family_links, notes, consent, sensitive,
  status, created_at, updated_at`;

const Devotee = {
  async create(d) {
    const { rows } = await pool.query(
      `INSERT INTO devotees
         (name, photo, gender, dob, phone, whatsapp, email, city, district, state, pincode, country,
          language, profession, relationship, tags, associated_temple, seva_interest,
          first_contact_at, family_links, notes, consent, sensitive)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
               COALESCE($19, NOW()),$20,$21,$22,$23)
       RETURNING ${COLS}`,
      [
        d.name, d.photo || null, d.gender || null, d.dob || null, d.phone || null,
        d.whatsapp || null, d.email || null, d.city || null, d.district || null, d.state || null,
        d.pincode || null, d.country || "India", d.language || "Kannada", d.profession || null,
        d.relationship || "new", d.tags || null, d.associated_temple || null, d.seva_interest || null,
        d.first_contact_at || null, d.family_links || null, d.notes || null,
        d.consent ?? false, d.sensitive ?? false,
      ]
    );
    const created = rows[0];
    // Assign a human-friendly devotee reference: DEV-YYYY-0001
    const year = new Date(created.created_at).getFullYear();
    const ref = `DEV-${year}-${String(created.id).padStart(4, "0")}`;
    const { rows: upd } = await pool.query(
      `UPDATE devotees SET devotee_ref = $1 WHERE id = $2 RETURNING ${COLS}`,
      [ref, created.id]
    );
    return upd[0];
  },

  async findAll({ limit = 300, offset = 0, search, relationship } = {}) {
    const where = [];
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      where.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length}
                   OR whatsapp ILIKE $${params.length} OR email ILIKE $${params.length}
                   OR devotee_ref ILIKE $${params.length} OR city ILIKE $${params.length})`);
    }
    if (relationship && relationship !== "all") {
      params.push(relationship);
      where.push(`relationship = $${params.length}`);
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    params.push(limit, offset);
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM devotees ${clause}
       ORDER BY updated_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(`SELECT ${COLS} FROM devotees WHERE id = $1`, [id]);
    return rows[0] || null;
  },

  async findByRef(ref) {
    const { rows } = await pool.query(`SELECT ${COLS} FROM devotees WHERE devotee_ref = $1`, [ref]);
    return rows[0] || null;
  },

  /* Duplicate detection (PRD §12-C): phone / whatsapp / email / name+city */
  async findDuplicates({ phone, whatsapp, email, name, city }) {
    const params = [];
    const ors = [];
    if (phone)    { params.push(phone);    ors.push(`phone = $${params.length}`); }
    if (whatsapp) { params.push(whatsapp); ors.push(`whatsapp = $${params.length}`); }
    if (email)    { params.push(email.toLowerCase()); ors.push(`LOWER(email) = $${params.length}`); }
    if (name && city) {
      params.push(name.toLowerCase(), city.toLowerCase());
      ors.push(`(LOWER(name) = $${params.length - 1} AND LOWER(city) = $${params.length})`);
    }
    if (!ors.length) return [];
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM devotees WHERE ${ors.join(" OR ")} ORDER BY created_at ASC LIMIT 5`,
      params
    );
    return rows;
  },

  async update(id, d) {
    const fields = [];
    const params = [];
    const set = (col, val) => { params.push(val); fields.push(`${col} = $${params.length}`); };
    const allowed = ["name","photo","gender","dob","phone","whatsapp","email","city","district","state","pincode",
      "country","language","profession","relationship","tags","associated_temple","seva_interest",
      "family_links","notes","consent","sensitive","status"];
    for (const k of allowed) if (k in d) set(k, d[k]);
    if (!fields.length) return this.findById(id);
    params.push(id);
    const { rows } = await pool.query(
      `UPDATE devotees SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${params.length} RETURNING ${COLS}`,
      params
    );
    return rows[0] || null;
  },

  /* Find-or-create a devotee from any intake (booking / case / contact) */
  async findOrCreateFrom({ name, phone, whatsapp, email, city, district, state, pincode, language, relationship }) {
    const dupes = await this.findDuplicates({ phone, whatsapp, email, name, city });
    if (dupes.length) return { devotee: dupes[0], created: false };
    const devotee = await this.create({
      name, phone, whatsapp: whatsapp || phone, email, city, district, state, pincode,
      language: language || "Kannada", relationship: relationship || "new",
      first_contact_at: new Date().toISOString(),
    });
    return { devotee, created: true };
  },

  /* ── Timeline (PRD §7) ─────────────────────────────────────────────── */
  async addTimeline(devotee_id, { event_type, title, description, related_entity_type, related_entity_id, icon }) {
    if (!devotee_id) return null;
    const { rows } = await pool.query(
      `INSERT INTO devotee_timeline
         (devotee_id, event_type, title, description, related_entity_type, related_entity_id, icon)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [devotee_id, event_type, title, description || null,
       related_entity_type || null, related_entity_id || null, icon || null]
    );
    return rows[0];
  },

  async getTimeline(devotee_id) {
    const { rows } = await pool.query(
      `SELECT * FROM devotee_timeline WHERE devotee_id = $1 ORDER BY created_at DESC`,
      [devotee_id]
    );
    return rows;
  },
};

export default Devotee;
