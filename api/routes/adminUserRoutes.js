import { Router } from "express";
import {
  getAllAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  sendOtp,
  verifyOtp,
} from "../controllers/adminUserController.js";

const router = Router();

router.get("/",           getAllAdminUsers);
router.post("/",          createAdminUser);
router.patch("/:id",      updateAdminUser);
router.delete("/:id",     deleteAdminUser);
router.post("/send-otp",  sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
