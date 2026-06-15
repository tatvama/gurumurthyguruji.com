import { Router } from "express";
import { notificationEmitter, recentNotifs, autoNotify } from "../utils/notifyWhatsApp.js";
import { pool } from "../config/db.js";

const router = Router();

/* GET /api/notifications/stream — SSE real-time push to admin dashboard */
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection",    "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  /* Heartbeat every 25 s to keep the connection alive through proxies */
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 25000);

  /* Push new notifications as they arrive */
  const onNotif = (evt) => {
    res.write(`event: notification\ndata: ${JSON.stringify(evt)}\n\n`);
  };
  notificationEmitter.on("notification", onNotif);

  req.on("close", () => {
    clearInterval(heartbeat);
    notificationEmitter.removeListener("notification", onNotif);
  });
});

/* GET /api/notifications/recent — last 50 in-memory events (no DB round-trip) */
router.get("/recent", (_req, res) => {
  res.json({ success: true, data: recentNotifs.slice(0, 50) });
});

/* GET /api/notifications/wa-logs — persistent WhatsApp log from DB */
router.get("/wa-logs", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const { rows } = await pool.query(
      `SELECT * FROM whatsapp_log ORDER BY created_at DESC LIMIT $1`, [limit]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

/* POST /api/notifications/test — send a test WhatsApp to CALLMEBOT_PHONE */
router.post("/test", async (req, res, next) => {
  try {
    const key  = process.env.CALLMEBOT_APIKEY;
    const phone = process.env.CALLMEBOT_PHONE;
    if (!key || key === "YOUR_API_KEY_HERE") {
      return res.status(400).json({
        success: false,
        message: "CALLMEBOT_APIKEY not configured. Add it to api/.env and restart the server.",
      });
    }
    if (!phone) {
      return res.status(400).json({ success: false, message: "CALLMEBOT_PHONE not set in api/.env" });
    }
    const evt = await autoNotify({
      template: "welcome",
      phone: phone.replace("91", ""),
      name: req.body.name || "Vinay Kumar",
      data: { devoteeRef: "TEST-001" },
    });
    res.json({ success: true, message: `Test notification sent to ${phone}`, data: evt });
  } catch (err) { next(err); }
});

export default router;
