import { Router } from "express";
import { requireRole } from "../middleware/requireAuth.js";
import {
  getAllAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  sendOtp,
  verifyOtp,
} from "../controllers/adminUserController.js";

const router = Router();

/* Public — login flow (no auth required, handled via PUBLIC_ROUTES in index.js) */
router.post("/send-otp",   sendOtp);
router.post("/verify-otp", verifyOtp);

/* GET — any logged-in admin role can read the list */
router.get("/",        requireRole("superadmin", "guruji", "admin"), getAllAdminUsers);
router.post("/",       requireRole("superadmin"), createAdminUser);
router.patch("/:id",   requireRole("superadmin"), updateAdminUser);
router.delete("/:id",  requireRole("superadmin"), deleteAdminUser);

export default router;
