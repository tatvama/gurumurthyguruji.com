/**
 * Comprehensive seed script — adds 5+ entries to every section.
 * Run: node api/scripts/seed.js   (from project root)
 */
import "dotenv/config";
import { pool, initDB } from "../config/db.js";

const ADMIN_PHONE = "9999999999"; // placeholder — replace with real number before running

/* ── helpers ──────────────────────────────────────────────────────── */
function log(msg) { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.warn(`  ⚠ ${msg}`); }

function caseRef() {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", D = "0123456789";
  const parts = [...Array(3).fill(0).map(() => D[Math.floor(Math.random()*D.length)]),
                 ...Array(4).fill(0).map(() => L[Math.floor(Math.random()*L.length)])];
  for (let i = parts.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1)); [parts[i],parts[j]]=[parts[j],parts[i]];
  }
  return parts.join("");
}

/* ════════════════════════════════════════════════════════════════════
   1. DEVOTEES
════════════════════════════════════════════════════════════════════ */
async function seedDevotees() {
  console.log("\n📿 Seeding Devotees...");
  const devotees = [
    { name: "Vinay Kumar",       phone: ADMIN_PHONE,   whatsapp: ADMIN_PHONE,   email: "vinay@example.com",   gender: "Male",   city: "Bangalore",    state: "Karnataka", language: "Kannada",  relationship: "devotee",  tags: ["VIP","Admin-Test"] },
    { name: "Ramesh Iyer",       phone: "9876543210",  whatsapp: "9876543210",  email: "ramesh@example.com",  gender: "Male",   city: "Chennai",      state: "Tamil Nadu",language: "Tamil",    relationship: "devotee",  tags: ["Trikala"] },
    { name: "Priya Sharma",      phone: "8765432109",  whatsapp: "8765432109",  email: "priya@example.com",   gender: "Female", city: "Mumbai",       state: "Maharashtra",language: "Hindi",  relationship: "new",      tags: ["Newcomer"] },
    { name: "Suresh Naidu",      phone: "7654321098",  whatsapp: "7654321098",  email: "suresh@example.com",  gender: "Male",   city: "Hyderabad",    state: "Telangana", language: "Telugu",   relationship: "devotee",  tags: ["Regular"] },
    { name: "Anita Devi",        phone: "6543210987",  whatsapp: "6543210987",  email: "anita@example.com",   gender: "Female", city: "Delhi",        state: "Delhi",     language: "Hindi",    relationship: "new",      tags: [] },
    { name: "Ganesh Krishnamurthy", phone: "9112233445", whatsapp: "9112233445", email: "ganesh@example.com", gender: "Male",   city: "Mysore",       state: "Karnataka", language: "Kannada",  relationship: "devotee",  tags: ["Long-time"] },
    { name: "Lakshmi Venkat",    phone: "9223344556",  whatsapp: "9223344556",  email: "lakshmi@example.com", gender: "Female", city: "Coimbatore",   state: "Tamil Nadu",language: "Tamil",    relationship: "devotee",  tags: ["Trikala"] },
  ];

  const created = [];
  for (const d of devotees) {
    try {
      const { rows: existing } = await pool.query(`SELECT id FROM devotees WHERE phone=$1 LIMIT 1`, [d.phone]);
      if (existing.length) { warn(`Devotee ${d.name} (${d.phone}) already exists — skipping`); created.push(existing[0]); continue; }
      const { rows } = await pool.query(
        `INSERT INTO devotees (name,phone,whatsapp,email,gender,city,state,country,language,relationship,tags,consent,first_contact_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'India',$8,$9,$10,true,NOW()) RETURNING id,name,phone`,
        [d.name,d.phone,d.whatsapp,d.email,d.gender,d.city,d.state,d.language,d.relationship,JSON.stringify(d.tags)]
      );
      const dev = rows[0];
      const year = new Date().getFullYear();
      const ref = `DEV-${year}-${String(dev.id).padStart(4,"0")}`;
      await pool.query(`UPDATE devotees SET devotee_ref=$1 WHERE id=$2`, [ref, dev.id]);
      log(`Devotee: ${d.name} → ${ref}`);
      created.push(dev);
    } catch(e) { warn(`Devotee ${d.name}: ${e.message}`); }
  }
  return created;
}

/* ════════════════════════════════════════════════════════════════════
   2. CONTACTS
════════════════════════════════════════════════════════════════════ */
async function seedContacts() {
  console.log("\n📬 Seeding Contacts...");
  const contacts = [
    { name: "Mohan Prasad",    email: "mohan@example.com",   subject: "Seeking divine guidance for family matters",     message: "Pranaam Guruji, I have been facing severe family disputes and health issues in my family. I humbly seek your divine guidance and blessings." },
    { name: "Kavitha Rao",     email: "kavitha@example.com", subject: "Career confusion — need Guruji's blessings",     message: "Respected Guruji, I am at a crossroads in my career. Unable to decide between two job offers. Seeking your divine wisdom." },
    { name: "Deepak Nair",     email: "deepak@example.com",  subject: "Health consultation for elderly mother",         message: "Guruji Namaskaram, My mother has been suffering from a chronic illness for 3 years. Doctors are unable to help. Requesting your divine intervention." },
    { name: "Sunita Agarwal",  email: "sunita@example.com",  subject: "Marriage guidance and horoscope matching",       message: "Pranaam Guruji, My daughter's marriage alliance is pending. The horoscopes match but we have doubts. Please guide us with your divine knowledge." },
    { name: "Prakash Kumar",   email: "prakash@example.com", subject: "Financial difficulties and business losses",     message: "Respected Guruji, My business has been declining for 2 years despite hard work. I suspect some negative energy. Seeking your powerful remedies." },
    { name: "Radha Venkatesh", email: "radha@example.com",   subject: "Spiritual guidance and meditation help",         message: "Guruji Namaskara, I want to progress on the spiritual path. Kindly guide me on the right sadhana and spiritual practices suitable for me." },
  ];

  for (const c of contacts) {
    try {
      const { rows: ex } = await pool.query(`SELECT id FROM contacts WHERE email=$1 LIMIT 1`, [c.email]);
      if (ex.length) { warn(`Contact ${c.name} already exists — skipping`); continue; }
      await pool.query(`INSERT INTO contacts (name,email,subject,message) VALUES ($1,$2,$3,$4)`, [c.name,c.email,c.subject,c.message]);
      log(`Contact: ${c.name}`);
    } catch(e) { warn(`Contact ${c.name}: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   3. APPOINTMENTS BOOKINGS
════════════════════════════════════════════════════════════════════ */
async function seedAudienceBookings() {
  console.log("\n🙏 Seeding Appointments Bookings...");
  const bookings = [
    { full_name: "Vinay Kumar",     mobile: ADMIN_PHONE,  email: "vinay@example.com",  profession: "Software Engineer", city: "Bangalore",  state: "Karnataka", location: "Bangalore",  how_known: "Friend",       nearest_ashram: "Bangalore Ashram",  message: "Seeking Guruji's blessings for family wellbeing and spiritual growth" },
    { full_name: "Sanjay Mishra",   mobile: "9334455667", email: "sanjay@example.com", profession: "Teacher",           city: "Lucknow",    state: "UP",        location: "Lucknow",    how_known: "Social Media", nearest_ashram: "Delhi Ashram",       message: "Want to meet Guruji personally for career and marriage guidance" },
    { full_name: "Meera Pillai",    mobile: "9445566778", email: "meera@example.com",  profession: "Doctor",            city: "Kochi",      state: "Kerala",    location: "Kochi",      how_known: "YouTube",      nearest_ashram: "Bangalore Ashram",  message: "Following Guruji for years. Want personal darshan and blessings" },
    { full_name: "Arjun Reddy",     mobile: "9556677889", email: "arjun@example.com",  profession: "Businessman",       city: "Vijayawada", state: "AP",        location: "Vijayawada", how_known: "Television",   nearest_ashram: "Hyderabad Ashram",  message: "Business going through difficult phase. Need Guruji's divine intervention" },
    { full_name: "Pooja Nambiar",   mobile: "9667788990", email: "pooja@example.com",  profession: "Housewife",         city: "Thrissur",   state: "Kerala",    location: "Thrissur",   how_known: "Temple",       nearest_ashram: "Bangalore Ashram",  message: "Son's health and education is concerning. Seeking Guruji's remedy" },
    { full_name: "Vijay Shankar",   mobile: "9778899001", email: "vijay@example.com",  profession: "Farmer",            city: "Dharwad",    state: "Karnataka", location: "Dharwad",    how_known: "Devotee",      nearest_ashram: "Hubli Ashram",      message: "Crop failures for 3 consecutive years. Need spiritual guidance" },
  ];

  for (const b of bookings) {
    try {
      const { rows: ex } = await pool.query(`SELECT id FROM audience_bookings WHERE mobile=$1 LIMIT 1`, [b.mobile]);
      if (ex.length) { warn(`Booking ${b.full_name} already exists — skipping`); continue; }
      await pool.query(
        `INSERT INTO audience_bookings (full_name,mobile,email,profession,city,state,location,how_known,nearest_ashram,message) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [b.full_name,b.mobile,b.email,b.profession,b.city,b.state,b.location,b.how_known,b.nearest_ashram,b.message]
      );
      log(`Booking: ${b.full_name}`);
    } catch(e) { warn(`Booking ${b.full_name}: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   4. TRIKALA CASES
════════════════════════════════════════════════════════════════════ */
async function seedTrikalaCases() {
  console.log("\n🔮 Seeding Trikala Cases...");
  const cases = [
    {
      case_reference: caseRef(), full_name: "Vinay Kumar",       mobile: ADMIN_PHONE,  email: "vinay@example.com",
      gender: "Male",   dob: "1990-05-15", pob: "Bangalore, Karnataka",     tob: "06:30",
      occupation: "Software Engineer",   city: "Bangalore",
      service_type: "Trikala Reading",   problem_category: "Career",
      guidance_query: "Facing stagnation in career for 2 years. Multiple promotions missed. Should I change company or wait? Also facing health issues related to stress.",
      priority: "High", preferred_language: "Kannada", consent: true, status: "Awaiting Guruji Review",
    },
    {
      case_reference: caseRef(), full_name: "Ramesh Iyer",       mobile: "9876543210", email: "ramesh@example.com",
      gender: "Male",   dob: "1985-11-22", pob: "Chennai, Tamil Nadu",       tob: "14:15",
      occupation: "Business Owner",      city: "Chennai",
      service_type: "Full Consultation", problem_category: "Finance",
      guidance_query: "Business suffering heavy losses since last year. Invested all savings and now in debt. Need divine guidance on whether to continue or close business.",
      priority: "Urgent", preferred_language: "Tamil", consent: true, status: "Under Review",
    },
    {
      case_reference: caseRef(), full_name: "Priya Sharma",      mobile: "8765432109", email: "priya@example.com",
      gender: "Female", dob: "1993-03-08", pob: "Mumbai, Maharashtra",       tob: "09:45",
      occupation: "Software Professional", city: "Mumbai",
      service_type: "Trikala Reading",   problem_category: "Marriage",
      guidance_query: "Delayed marriage despite parents' efforts. All alliances breaking at last stage. Age 31 and family is worried. Is there any dosha in kundali?",
      priority: "High", preferred_language: "Hindi", consent: true, status: "Remedy Assigned",
    },
    {
      case_reference: caseRef(), full_name: "Suresh Naidu",      mobile: "7654321098", email: "suresh@example.com",
      gender: "Male",   dob: "1978-07-19", pob: "Hyderabad, Telangana",      tob: "22:00",
      occupation: "Government Employee", city: "Hyderabad",
      service_type: "Full Consultation", problem_category: "Health",
      guidance_query: "Chronic back pain and joint issues for 5 years. Doctors say no permanent cure. Also facing disturbed sleep and negative thoughts. Need Guruji's healing remedy.",
      priority: "Normal", preferred_language: "Telugu", consent: true, status: "Follow-up Scheduled",
    },
    {
      case_reference: caseRef(), full_name: "Lakshmi Venkat",    mobile: "9223344556", email: "lakshmi@example.com",
      gender: "Female", dob: "1975-12-01", pob: "Coimbatore, Tamil Nadu",    tob: "11:30",
      occupation: "Teacher",             city: "Coimbatore",
      service_type: "Trikala Reading",   problem_category: "Family",
      guidance_query: "Constant fights with husband and in-laws. Son's studies affected. Family atmosphere very negative. Please guide us with appropriate remedies to restore harmony.",
      priority: "Normal", preferred_language: "Tamil", consent: true, status: "Submitted",
    },
    {
      case_reference: caseRef(), full_name: "Ganesh Krishnamurthy", mobile: "9112233445", email: "ganesh@example.com",
      gender: "Male",   dob: "1982-08-25", pob: "Mysore, Karnataka",         tob: "05:00",
      occupation: "Retired Officer",     city: "Mysore",
      service_type: "Full Consultation", problem_category: "Spiritual",
      guidance_query: "Deep interest in spirituality. Want guidance on correct path of sadhana. Also son's career not settling despite good education. Seeking divine blessings for both.",
      priority: "Normal", preferred_language: "Kannada", consent: true, status: "AI Draft Generated",
    },
  ];

  const refs = [];
  for (const c of cases) {
    try {
      const { rows: ex } = await pool.query(`SELECT id FROM trikala_readings WHERE mobile=$1 LIMIT 1`, [c.mobile]);
      if (ex.length) { warn(`Trikala case for ${c.full_name} already exists — skipping`); refs.push({ caseRef: ex[0].id, mobile: c.mobile, name: c.full_name }); continue; }

      /* Link devotee if exists */
      const { rows: dev } = await pool.query(`SELECT id FROM devotees WHERE phone=$1 LIMIT 1`, [c.mobile]);
      const devotee_id = dev[0]?.id || null;

      const { rows } = await pool.query(
        `INSERT INTO trikala_readings
           (case_reference,full_name,mobile,email,gender,dob,tob,pob,occupation,city,
            service_type,problem_category,guidance_query,priority,preferred_language,
            consent,devotee_id,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         RETURNING case_reference,full_name`,
        [c.case_reference,c.full_name,c.mobile,c.email,c.gender,c.dob,c.tob,c.pob,
         c.occupation,c.city,c.service_type,c.problem_category,c.guidance_query,
         c.priority,c.preferred_language,c.consent,devotee_id,c.status]
      );
      log(`Trikala Case: ${rows[0].full_name} → ${rows[0].case_reference} [${c.status}]`);
      refs.push({ caseRef: rows[0].case_reference, mobile: c.mobile, name: c.full_name });
    } catch(e) { warn(`Trikala ${c.full_name}: ${e.message}`); }
  }
  return refs;
}

/* ════════════════════════════════════════════════════════════════════
   5. APPOINTMENTS
════════════════════════════════════════════════════════════════════ */
async function seedAppointments(caseRefs) {
  console.log("\n📅 Seeding Appointments...");
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const d2 = new Date(); d2.setDate(d2.getDate()+3);
  const d3 = new Date(); d3.setDate(d3.getDate()+5);
  const d4 = new Date(); d4.setDate(d4.getDate()+7);
  const d5 = new Date(); d5.setDate(d5.getDate()+10);
  const d6 = new Date(); d6.setDate(d6.getDate()-2);

  const fmtDt = (d, h, m) => { const dt = new Date(d); dt.setHours(h,m,0,0); return dt.toISOString(); };

  const appointments = [
    { devotee_name: "Vinay Kumar",        mobile: ADMIN_PHONE,  appointment_type: "Trikala Consultation", mode: "in-person", start_time: fmtDt(tomorrow,10,0),  status: "Confirmed",  priority: "High",   location: "Bangalore Ashram",  purpose: "Trikala reading discussion and remedy guidance", case_reference: caseRefs[0]?.caseRef },
    { devotee_name: "Ramesh Iyer",        mobile: "9876543210", appointment_type: "General Audience",      mode: "in-person", start_time: fmtDt(d2,11,30),       status: "Scheduled",  priority: "Normal", location: "Bangalore Ashram",  purpose: "Personal meeting with Guruji for business guidance" },
    { devotee_name: "Priya Sharma",       mobile: "8765432109", appointment_type: "Phone Call",            mode: "phone",     start_time: fmtDt(d3,15,0),        status: "Approved",   priority: "High",   location: "",                  purpose: "Follow up on marriage remedy progress", case_reference: caseRefs[2]?.caseRef },
    { devotee_name: "Suresh Naidu",       mobile: "7654321098", appointment_type: "Video Call",            mode: "video",     start_time: fmtDt(d4,9,0),         status: "Requested",  priority: "Normal", meeting_link: "https://meet.google.com/xyz-abc-def", purpose: "Health follow-up consultation" },
    { devotee_name: "Lakshmi Venkat",     mobile: "9223344556", appointment_type: "Trikala Consultation", mode: "in-person", start_time: fmtDt(d5,14,0),        status: "Requested",  priority: "Normal", location: "Coimbatore Temple", purpose: "Initial Trikala consultation" },
    { devotee_name: "Ganesh Krishnamurthy",mobile:"9112233445",  appointment_type: "General Audience",     mode: "in-person", start_time: fmtDt(d6,10,0),        status: "Completed",  priority: "Normal", location: "Mysore Ashram",     purpose: "Spiritual guidance session", outcome_note: "Guruji gave detailed guidance on sadhana. Devotee very satisfied. Follow-up in 3 months." },
  ];

  for (const a of appointments) {
    try {
      const { rows: ex } = await pool.query(
        `SELECT id FROM appointments WHERE mobile=$1 AND appointment_type=$2 AND start_time=$3 LIMIT 1`,
        [a.mobile, a.appointment_type, a.start_time]
      );
      if (ex.length) { warn(`Appointment ${a.devotee_name} already exists — skipping`); continue; }

      const { rows: dev } = await pool.query(`SELECT id FROM devotees WHERE phone=$1 LIMIT 1`, [a.mobile]);
      const devotee_id = dev[0]?.id || null;

      const { rows } = await pool.query(
        `INSERT INTO appointments (devotee_id,devotee_name,mobile,appointment_type,mode,start_time,status,priority,location,meeting_link,purpose,outcome_note,case_reference)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING id,devotee_name,appointment_type`,
        [devotee_id,a.devotee_name,a.mobile,a.appointment_type,a.mode,a.start_time,a.status,a.priority,
         a.location||null,a.meeting_link||null,a.purpose||null,a.outcome_note||null,a.case_reference||null]
      );
      const appt = rows[0];
      const ref = `APT-${new Date().getFullYear()}-${String(appt.id).padStart(4,"0")}`;
      await pool.query(`UPDATE appointments SET appointment_ref=$1 WHERE id=$2`, [ref, appt.id]);
      log(`Appointment: ${appt.devotee_name} — ${appt.appointment_type} → ${ref}`);
    } catch(e) { warn(`Appointment ${a.devotee_name}: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   6. REMEDY LIBRARY
════════════════════════════════════════════════════════════════════ */
async function seedRemedyLibrary() {
  console.log("\n🕯️  Seeding Remedy Library...");
  const remedies = [
    { name: "Hanuman Chalisa Parayana",    category: "Mantra",    default_instruction: "Recite Hanuman Chalisa 11 times daily for 41 days. Light a diya with sesame oil. Start on Tuesday or Saturday.",    default_duration: "41 days",  language: "Hindi",    followup_required: true },
    { name: "Navagraha Shanti Puja",        category: "Puja",      default_instruction: "Perform Navagraha Shanti at a Shiva temple. Donate 9 types of grains to 9 brahmins on a Saturday.",                default_duration: "One-time", language: "Sanskrit", followup_required: false },
    { name: "Mahamrityunjaya Japa",         category: "Mantra",    default_instruction: "Chant Mahamrityunjaya mantra 108 times daily. Best performed during Brahma Muhurta (4-6 AM). Visualize Lord Shiva.", default_duration: "21 days",  language: "Sanskrit", followup_required: true },
    { name: "Satyanarayan Katha",           category: "Puja",      default_instruction: "Perform Sri Satyanarayan Katha with family on a full moon day. Offer prasad to 11 devotees.",                        default_duration: "One-time", language: "Hindi",    followup_required: false },
    { name: "Dhanvantari Abhishekam",       category: "Seva",      default_instruction: "Perform Abhishekam to Lord Dhanvantari on Thursdays with turmeric water. Offer yellow flowers and naivedyam.",       default_duration: "9 Thursdays", language: "Sanskrit", followup_required: true },
    { name: "Surya Namaskar Sadhana",       category: "Meditation",default_instruction: "Perform 12 rounds of Surya Namaskar daily facing East at sunrise. Chant Aditya Hridayam during practice.",         default_duration: "40 days",  language: "Sanskrit", followup_required: false },
    { name: "Rudrabhishekam",               category: "Puja",      default_instruction: "Perform Rudrabhishekam at a Shiva temple on Mondays. Offer Bilva leaves and milk abhishekam.",                       default_duration: "5 Mondays",language: "Sanskrit", followup_required: true },
    { name: "Vishnu Sahasranama Parayana",  category: "Mantra",    default_instruction: "Recite Vishnu Sahasranama once daily after morning bath. Light incense and offer Tulsi leaves to Lord Vishnu.",       default_duration: "30 days",  language: "Sanskrit", followup_required: false },
    { name: "Annadana Seva",                category: "Seva",      default_instruction: "Feed 11 poor/needy people on every Saturday for 9 weeks. Do this with pure intention without expecting anything.",    default_duration: "9 Saturdays", language: "Kannada", followup_required: true },
    { name: "Kali Kavach Recitation",       category: "Mantra",    default_instruction: "Recite Kali Kavach daily at dusk for 21 days. Keep a lamp burning with mustard oil throughout the recitation.",      default_duration: "21 days",  language: "Sanskrit", followup_required: true },
  ];

  for (const r of remedies) {
    try {
      const { rows: ex } = await pool.query(`SELECT id FROM remedies WHERE name=$1 LIMIT 1`, [r.name]);
      if (ex.length) { warn(`Remedy "${r.name}" already exists — skipping`); continue; }
      await pool.query(
        `INSERT INTO remedies (name,category,default_instruction,default_duration,language,followup_required,active)
         VALUES ($1,$2,$3,$4,$5,$6,true)`,
        [r.name,r.category,r.default_instruction,r.default_duration,r.language,r.followup_required]
      );
      log(`Remedy: ${r.name} [${r.category}]`);
    } catch(e) { warn(`Remedy ${r.name}: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   7. CASE REMEDIES (assign remedies to cases)
════════════════════════════════════════════════════════════════════ */
async function seedCaseRemedies(caseRefs) {
  if (!caseRefs.length) return;
  console.log("\n🪔  Assigning Case Remedies...");

  const assignments = [
    { idx: 0, remedy_name: "Hanuman Chalisa Parayana", category: "Mantra", custom_instruction: "Recite 11 times daily for 41 days. Start on Tuesday. Report progress after 21 days.", status: "Assigned" },
    { idx: 1, remedy_name: "Navagraha Shanti Puja",    category: "Puja",   custom_instruction: "Perform at Sri Shiva temple on Saturday. Donate to 9 brahmins. For business recovery.", status: "In Progress" },
    { idx: 2, remedy_name: "Vishnu Sahasranama Parayana", category: "Mantra", custom_instruction: "Recite daily for 30 days. Also observe fast on Thursdays. For removal of marriage obstacles.", status: "Assigned" },
    { idx: 3, remedy_name: "Dhanvantari Abhishekam",   category: "Seva",   custom_instruction: "9 consecutive Thursdays at nearest Vishnu temple. For health restoration.", status: "Completed" },
    { idx: 4, remedy_name: "Satyanarayan Katha",        category: "Puja",   custom_instruction: "Perform on the next Purnima with family. Invite 11 devotees. For family harmony.", status: "Assigned" },
  ];

  for (const a of assignments) {
    const cr = caseRefs[a.idx];
    if (!cr) continue;
    try {
      const { rows: ex } = await pool.query(
        `SELECT id FROM case_remedies WHERE case_reference=$1 AND remedy_name=$2 LIMIT 1`,
        [cr.caseRef, a.remedy_name]
      );
      if (ex.length) { warn(`Case remedy already exists — skipping`); continue; }

      const { rows: dev } = await pool.query(`SELECT id FROM devotees WHERE phone=$1 LIMIT 1`, [cr.mobile]);
      await pool.query(
        `INSERT INTO case_remedies (case_reference,devotee_id,remedy_name,category,custom_instruction,start_date,status)
         VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,$6)`,
        [cr.caseRef, dev[0]?.id||null, a.remedy_name, a.category, a.custom_instruction, a.status]
      );
      log(`Case Remedy: ${cr.name} ← ${a.remedy_name} [${a.status}]`);
    } catch(e) { warn(`Case remedy ${a.remedy_name}: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   8. CASE NOTES
════════════════════════════════════════════════════════════════════ */
async function seedCaseNotes(caseRefs) {
  if (!caseRefs.length) return;
  console.log("\n📝 Seeding Case Notes...");

  const noteData = [
    { idx: 0, notes: ["Case reviewed by Guruji. Strong Rahu-Ketu axis affecting career. Saturn 7th causing delays.", "Admin: Devotee called today. Very distressed. Urgent review requested.", "Guruji prescribed specific Shani mantra. Will follow up in 21 days."] },
    { idx: 1, notes: ["Business case — Jupiter afflicted in 11th house. Mercury retrograde effect visible.", "Devotee confirmed financial losses. Total debt: significant. Needs immediate spiritual intervention.", "Remedy assigned: Navagraha puja + business timing correction based on Trikala analysis."] },
    { idx: 2, notes: ["Marriage delays — Venus in 6th house with Rahu. Classical 'Mangal Dosha' present.", "Three alliances broke mysteriously. Guruji suspects strong 7th house affliction.", "Remedy: Vishnu Sahasranama for 30 days + specific temple visit prescribed."] },
  ];

  for (const { idx, notes } of noteData) {
    const cr = caseRefs[idx];
    if (!cr) continue;
    for (const noteText of notes) {
      try {
        const { rows: ex } = await pool.query(
          `SELECT id FROM case_notes WHERE case_reference=$1 AND text=$2 LIMIT 1`,
          [cr.caseRef, noteText]
        );
        if (ex.length) continue;
        await pool.query(
          `INSERT INTO case_notes (case_reference,text) VALUES ($1,$2)`,
          [cr.caseRef, noteText]
        );
      } catch(e) { warn(`Case note: ${e.message}`); }
    }
    log(`Case notes for ${cr.name}`);
  }
}

/* ════════════════════════════════════════════════════════════════════
   9. CASE FOLLOWUPS
════════════════════════════════════════════════════════════════════ */
async function seedCaseFollowups(caseRefs) {
  if (!caseRefs.length) return;
  console.log("\n🔄 Seeding Case Followups...");

  const now = new Date();
  const addDays = (d) => new Date(now.getTime() + d*86400000).toISOString();
  const followups = [
    { idx: 0, type: "Call",   date_time: addDays(7),   notes: "Call devotee to check Hanuman Chalisa progress. Verify daily practice compliance." },
    { idx: 1, type: "Review", date_time: addDays(14),  notes: "Business remedy follow-up. Check if Navagraha puja was completed. Business improvement check." },
    { idx: 2, type: "Call",   date_time: addDays(21),  notes: "Marriage remedy review. Check temple visit completion and marriage alliance update." },
    { idx: 3, type: "Review", date_time: addDays(-3),  notes: "Health follow-up — 9 week Dhanvantari abhishekam completed. Pain level assessment." },
    { idx: 4, type: "Call",   date_time: addDays(5),   notes: "Family harmony check — Satyanarayan Katha upcoming. Confirm family participation." },
  ];

  for (const f of followups) {
    const cr = caseRefs[f.idx];
    if (!cr) continue;
    try {
      const { rows: ex } = await pool.query(
        `SELECT id FROM case_followups WHERE case_reference=$1 AND notes=$2 LIMIT 1`,
        [cr.caseRef, f.notes]
      );
      if (ex.length) { warn(`Followup already exists — skipping`); continue; }
      await pool.query(
        `INSERT INTO case_followups (case_reference,type,date_time,notes) VALUES ($1,$2,$3,$4)`,
        [cr.caseRef, f.type, f.date_time, f.notes]
      );
      log(`Followup: ${cr.name} — ${f.type} [${new Date(f.date_time).toLocaleDateString()}]`);
    } catch(e) { warn(`Followup: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   10. ADMIN USERS
════════════════════════════════════════════════════════════════════ */
async function seedAdminUsers() {
  console.log("\n👤 Seeding Admin Users...");
  const admins = [
    { name: "Vinay Kumar",      mobile: ADMIN_PHONE,  role: "superadmin" },
    { name: "Seva Coordinator", mobile: "9111222333", role: "trikala_admin" },
    { name: "Appointment Desk", mobile: "9222333444", role: "appt_manager" },
    { name: "Devotee Manager",  mobile: "9333444555", role: "devotee_manager" },
    { name: "Report Editor",    mobile: "9444555666", role: "report_editor" },
  ];

  for (const a of admins) {
    try {
      const { rows: ex } = await pool.query(`SELECT id FROM admin_users WHERE mobile=$1 LIMIT 1`, [a.mobile]);
      if (ex.length) { warn(`Admin ${a.name} already exists — skipping`); continue; }
      await pool.query(
        `INSERT INTO admin_users (name,mobile,role,password,status) VALUES ($1,$2,$3,'123456','active')`,
        [a.name, a.mobile, a.role]
      );
      log(`Admin: ${a.name} [${a.role}]`);
    } catch(e) { warn(`Admin ${a.name}: ${e.message}`); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  Gurumurthy Guruji — Comprehensive Seed Script");
  console.log(`  Admin phone: ${ADMIN_PHONE}`);
  console.log("═══════════════════════════════════════════════════════");

  await initDB();

  await seedAdminUsers();
  const _devotees  = await seedDevotees();
  await seedContacts();
  await seedAudienceBookings();
  const caseRefs   = await seedTrikalaCases();
  await seedAppointments(caseRefs);
  await seedRemedyLibrary();
  await seedCaseRemedies(caseRefs);
  await seedCaseNotes(caseRefs);
  await seedCaseFollowups(caseRefs);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  ✅ Seeding complete! All sections now have data.");
  console.log("═══════════════════════════════════════════════════════\n");

  await pool.end();
}

main().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
