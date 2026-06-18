import { EventEmitter } from "events";
import https from "https";
import { pool } from "../config/db.js";

/* Global in-process emitter — controllers emit here, SSE route listens */
export const notificationEmitter = new EventEmitter();
notificationEmitter.setMaxListeners(50);

/* Recent notification buffer (last 100 events, in-memory) */
export const recentNotifs = [];

notificationEmitter.on("notification", (evt) => {
  recentNotifs.unshift(evt);
  if (recentNotifs.length > 100) recentNotifs.pop();
});

const TEMPLATES = {
  appointment_reminder: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nThis is a reminder for your appointment with Pujya Sri Gurumurthy Guruji.\n\n` +
    `📅 Date: ${d.date || "—"}\n⏰ Time: ${d.time || "—"}\n📍 ${d.location || "Guruji Ashram"}\n\n` +
    `Please arrive 15 minutes early. Bring any relevant documents.\n\n🕉️ Jay Guruji\n— Seva Team`,

  appointment_scheduled: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour appointment with Pujya Sri Gurumurthy Guruji has been scheduled.\n\n` +
    `📅 ${d.date || "—"}\n📍 ${d.venue || "Guruji Ashram"}\n\n` +
    `Please arrive 15 minutes early with any relevant documents.\n\n🕉️ Jay Guruji\n— Seva Team`,

  appointment_rescheduled: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour appointment with Guruji has been rescheduled.\n\n` +
    `⏪ Earlier: ${d.old_date_time || "—"}\n⏩ New: ${d.new_date_time || "—"}\n` +
    `${d.reason ? `📝 Reason: ${d.reason}\n` : ""}` +
    `\nWe look forward to your darshan.\n\n🕉️ Jay Guruji`,

  appointment_cancelled: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour appointment with Guruji has been cancelled.\n\n` +
    `${d.reason ? `📝 Reason: ${d.reason}\n` : ""}` +
    `\nOur office may contact you for follow-up if required.\n\n🕉️ Jay Guruji`,

  case_submitted: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour Trikala consultation request has been received.\n\n` +
    `📋 Case Ref: ${d.caseRef || "—"}\n📖 Service: ${d.serviceType || "Trikala"}\n\n` +
    `Guruji will personally review your request. We will contact you once the reading is ready.\n\n🕉️ Jay Guruji`,

  case_ready: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nYour Trikala consultation is ready.\n\n` +
    `📋 Case Ref: ${d.caseRef || "—"}\n\n` +
    `Pujya Guruji has personally reviewed your case. Please contact us to receive your consultation.\n\n🕉️ Jay Guruji`,

  remedy_assigned: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nDivine remedy has been assigned for your case.\n\n` +
    `💫 Remedy: ${d.remedy || "—"}\n⏱️ Duration: ${d.duration || "As advised"}\n` +
    `${d.mantra ? `📿 Mantra: ${d.mantra}\n` : ""}` +
    `\nPlease follow the instructions with devotion and faith.\n\n🕉️ Jay Guruji`,

  followup_reminder: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nThis is a follow-up from the Gurumurthy Guruji Seva team.\n\n` +
    `We wanted to check on your progress with the prescribed remedy/guidance.\n` +
    `${d.caseRef ? `\n📋 Case Ref: ${d.caseRef}` : ""}` +
    `\n\nPlease feel free to contact us with any questions or updates.\n\n🕉️ Jay Guruji`,

  welcome: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nWelcome to the divine service of Pujya Sri Gurumurthy Guruji.\n\n` +
    `You are now registered in our Devotee 360 system.\n` +
    `${d.devoteeRef ? `\n🆔 Devotee ID: ${d.devoteeRef}` : ""}` +
    `\n\nMay Guruji's blessings always be with you.\n\n🕉️ Jay Guruji\n— Seva Team`,

  intake_incomplete: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nWe noticed your Trikala case (${d.caseRef || "—"}) has some missing information.\n\n` +
    `📋 Missing: ${d.missing || "Time of birth / Place of birth"}\n\n` +
    `Please provide this information at the earliest so Guruji can review your case.\n\n🕉️ Jay Guruji`,

  no_show_followup: (d) =>
    `🙏 Namaskara ${d.name || ""},\n\nWe noticed you missed your appointment on ${d.date || "—"}.\n\n` +
    `Please contact us to reschedule. Guruji's time is sacred and limited.\n\n` +
    `📞 Call / WhatsApp to reschedule.\n\n🕉️ Jay Guruji`,
};

/**
 * Auto-trigger a WhatsApp notification:
 * 1. Builds the message from template
 * 2. Logs to whatsapp_log table
 * 3. Emits SSE event so admin dashboard shows real-time alert
 *
 * @param {object} opts
 * @param {string} opts.template   - one of the 8 template keys
 * @param {string} opts.phone      - 10-digit mobile number
 * @param {string} opts.name       - devotee name for greeting
 * @param {object} [opts.data]     - extra template variables
 * @param {number|null} [opts.devotee_id]
 * @param {string|null} [opts.case_reference]
 */
export async function autoNotify({ template, phone, name, data = {}, devotee_id = null, case_reference = null }) {
  const tpl = TEMPLATES[template];
  if (!tpl || !phone) return null;

  const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
  if (cleanPhone.length !== 10) return null;

  const message = tpl({ name, ...data });
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

  /* Log to DB */
  try {
    await pool.query(
      `INSERT INTO whatsapp_log (devotee_id, case_reference, phone, template, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [devotee_id || null, case_reference || null, cleanPhone, template, message]
    );
  } catch (e) {
    console.error("[autoNotify] log error:", e.message);
  }

  /* ── CallMeBot: actually send WhatsApp to the phone ──────────────
     Requires CALLMEBOT_APIKEY in .env.
     Recipient must first activate: WhatsApp "+34 644 62 39 23"
     with message "I allow callmebot to send me messages"          */
  const callMeBotKey = process.env.CALLMEBOT_APIKEY;
  const callMeBotPhone = process.env.CALLMEBOT_PHONE; // admin's number
  if (callMeBotKey && callMeBotPhone) {
    sendCallMeBot(callMeBotPhone, callMeBotKey, message).catch((e) =>
      console.error("[CallMeBot] send error:", e.message)
    );
  }

  /* Emit real-time SSE event */
  const evt = {
    id: Date.now(),
    type: "whatsapp_notification",
    template,
    name: name || "Devotee",
    phone: cleanPhone,
    message,
    waUrl,
    case_reference: case_reference || null,
    created_at: new Date().toISOString(),
  };
  notificationEmitter.emit("notification", evt);

  return evt;
}

/**
 * Send a WhatsApp message via CallMeBot free API.
 * @param {string} phone  - with country code,
 * @param {string} apikey - from CallMeBot activation reply
 * @param {string} text   - message body
 */
function sendCallMeBot(phone, apikey, text) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`;
    https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(`[CallMeBot] ✓ Message sent to ${phone}`);
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 100)}`));
        }
      });
    }).on("error", reject);
  });
}
