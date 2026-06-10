import AdminUser from "../models/AdminUser.js";

/* ── GET all admins ─────────────────────────────────────────────── */
export const getAllAdminUsers = async (req, res, next) => {
  try {
    const rows = await AdminUser.findAll();
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

/* ── POST create admin ──────────────────────────────────────────── */
export const createAdminUser = async (req, res, next) => {
  try {
    const { name, mobile, role } = req.body;
    if (!name || !mobile)
      return res.status(400).json({ success: false, message: "Name and mobile are required." });
    if (!/^\d{10}$/.test(mobile))
      return res.status(400).json({ success: false, message: "Mobile must be 10 digits." });
    const existing = await AdminUser.findByMobile(mobile);
    if (existing)
      return res.status(409).json({ success: false, message: "Mobile number already registered." });
    const record = await AdminUser.create({ name, mobile, role });
    res.status(201).json({ success: true, data: record });
  } catch (err) { next(err); }
};

/* ── PATCH update admin ─────────────────────────────────────────── */
export const updateAdminUser = async (req, res, next) => {
  try {
    const { name, role, status } = req.body;
    const id = parseInt(req.params.id);
    if (!name)
      return res.status(400).json({ success: false, message: "Name is required." });
    const record = await AdminUser.update(id, { name, role, status });
    if (!record) return res.status(404).json({ success: false, message: "Admin not found." });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
};

/* ── DELETE admin ───────────────────────────────────────────────── */
export const deleteAdminUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const record = await AdminUser.findById(id);
    if (!record) return res.status(404).json({ success: false, message: "Admin not found." });
    if (record.role === "superadmin")
      return res.status(403).json({ success: false, message: "Cannot delete a super admin." });
    await AdminUser.delete(id);
    res.json({ success: true, message: "Admin deleted." });
  } catch (err) { next(err); }
};

/* ── POST send-otp (validate mobile exists) ─────────────────────── */
export const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile)
      return res.status(400).json({ success: false, message: "Mobile is required." });
    const admin = await AdminUser.findByMobile(mobile);
    if (!admin || admin.status !== "active")
      return res.status(404).json({ success: false, message: "Mobile not registered as admin." });
    // In production: generate & send real OTP via SMS
    // Here we return the stored password as the OTP for dev
    res.json({ success: true, message: "OTP sent.", otp: admin.password });
  } catch (err) { next(err); }
};

/* ── POST verify-otp ────────────────────────────────────────────── */
export const verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp)
      return res.status(400).json({ success: false, message: "Mobile and OTP are required." });
    const admin = await AdminUser.findByMobile(mobile);
    if (!admin || admin.status !== "active")
      return res.status(404).json({ success: false, message: "Admin not found." });
    if (String(admin.password) !== String(otp))
      return res.status(401).json({ success: false, message: "Incorrect OTP." });
    await AdminUser.updateLastLogin(admin.id);
    res.json({
      success: true,
      message: "Login successful.",
      data: { id: admin.id, name: admin.name, mobile: admin.mobile, role: admin.role },
    });
  } catch (err) { next(err); }
};
