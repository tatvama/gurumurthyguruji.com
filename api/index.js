import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { globalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { initDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import audienceRoutes from "./routes/audienceRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import trikalaRoutes from "./routes/trikalaRoutes.js";
import caseNotesRoutes from "./routes/caseNotesRoutes.js";
import caseFollowupsRoutes from "./routes/caseFollowupsRoutes.js";
import casePadRoutes from "./routes/casePadRoutes.js";
import devoteeRoutes from "./routes/devoteeRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import aiReportRoutes from "./routes/aiReportRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any localhost port in development
      if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
      // Allow LAN IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (/^http:\/\/(192\.168|10\.\d+|172\.(1[6-9]|2\d|3[01]))\.\d+\.\d+(:\d+)?$/.test(origin)) return callback(null, true);
      // Allow configured production URL
      const allowed = process.env.CLIENT_URL;
      if (allowed && origin === allowed) return callback(null, true);
      callback(new Error("CORS: origin not allowed"));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-name", "x-admin-mobile", "x-admin-key"],
    credentials: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use(globalLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ── Public routes that skip authentication ──────────────────────────
   These are the only endpoints accessible without admin credentials.
   Every other /api/* route requires valid x-admin-mobile + x-admin-key headers.
──────────────────────────────────────────────────────────────────── */
const PUBLIC_ROUTES = [
  { method: "POST", path: "/api/contacts" },
  { method: "POST", path: "/api/appointment-bookings" },
  { method: "POST", path: "/api/trikala-readings" },
  { method: "POST", path: "/api/admin-users/send-otp" },
  { method: "POST", path: "/api/admin-users/verify-otp" },
  { method: "GET",  path: "/api/notifications/stream" },
];

app.use((req, res, next) => {
  const isPublic = PUBLIC_ROUTES.some(
    (r) => r.method === req.method && req.path === r.path
  );
  if (isPublic) return next();
  return requireAuth(req, res, next);
});

app.use("/api/contacts", contactRoutes);
app.use("/api/appointment-bookings", audienceRoutes);
app.use("/api/admin-users", adminUserRoutes);
app.use("/api/trikala-readings", trikalaRoutes);
app.use("/api/case-notes",      caseNotesRoutes);
app.use("/api/case-followups",  caseFollowupsRoutes);
app.use("/api/case-pad",        casePadRoutes);
app.use("/api/devotees",        devoteeRoutes);
app.use("/api/appointments",    appointmentRoutes);
app.use("/api/ai-reports",      aiReportRoutes);
app.use("/api/audit-logs",      auditRoutes);
app.use("/api/dashboard",       dashboardRoutes);
app.use("/api/chat",            chatRoutes);
app.use("/api/whatsapp",        whatsappRoutes);
app.use("/api/settings",        settingsRoutes);
app.use("/api/documents",       documentRoutes);
app.use("/api/notifications",   notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use(errorHandler);

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialise database:", err.message);
    process.exit(1);
  });
