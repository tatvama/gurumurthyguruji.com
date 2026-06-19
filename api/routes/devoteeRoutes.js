import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { requireRole } from "../middleware/requireAuth.js";
import {
  getDevotees, getDevotee, getDevoteeHistory, checkDuplicate,
  createDevotee, updateDevotee, getTimeline, addTimelineEvent,
} from "../controllers/devoteeController.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");

const router = Router();

router.get("/",                ALL_ADMIN,   getDevotees);
router.post("/check-duplicate", ALL_ADMIN,  checkDuplicate);
router.post(
  "/",
  ADMIN_SUPER,
  validate([body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 160 })]),
  createDevotee
);
router.get("/:id",          ALL_ADMIN,   getDevotee);
router.get("/:id/history",  ALL_ADMIN,   getDevoteeHistory);
router.patch("/:id",        ADMIN_SUPER, updateDevotee);
router.get("/:id/timeline", ALL_ADMIN,   getTimeline);
router.post("/:id/timeline", ADMIN_SUPER, addTimelineEvent);

export default router;
