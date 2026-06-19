import AdminUser from "../models/AdminUser.js";

/**
 * requireAuth — validates X-Admin-Mobile + X-Admin-Key headers against the DB.
 * On success, sets req.user = { id, name, mobile, role }.
 * Must run before any requireRole guard.
 */
export const requireAuth = async (req, res, next) => {
  const mobile = req.headers["x-admin-mobile"];
  const key    = req.headers["x-admin-key"];

  if (!mobile || !key)
    return res.status(401).json({ success: false, message: "Authentication required." });

  try {
    const admin = await AdminUser.findByMobile(mobile);
    if (!admin || admin.status !== "active" || String(admin.password) !== String(key))
      return res.status(401).json({ success: false, message: "Invalid credentials." });

    req.user = { id: admin.id, name: admin.name, mobile: admin.mobile, role: admin.role };
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * requireRole(...roles) — checks req.user.role against the allowed list.
 * Must be used AFTER requireAuth in the middleware chain.
 *
 * Usage:
 *   router.delete("/:id", requireAuth, requireRole("superadmin"), handler)
 *   router.patch("/:id/vakya", requireAuth, requireRole("guruji", "superadmin"), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ success: false, message: "Not authenticated." });

  const allowed = roles.flat();
  if (!allowed.includes(req.user.role))
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${allowed.join(" or ")}.`,
    });

  next();
};
