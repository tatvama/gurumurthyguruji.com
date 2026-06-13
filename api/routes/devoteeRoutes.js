import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import {
  getDevotees, getDevotee, getDevoteeHistory, checkDuplicate,
  createDevotee, updateDevotee, getTimeline, addTimelineEvent,
} from "../controllers/devoteeController.js";

const router = Router();

router.get("/", getDevotees);
router.post("/check-duplicate", checkDuplicate);
router.post(
  "/",
  validate([body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 160 })]),
  createDevotee
);
router.get("/:id", getDevotee);
router.get("/:id/history", getDevoteeHistory);
router.patch("/:id", updateDevotee);
router.get("/:id/timeline", getTimeline);
router.post("/:id/timeline", addTimelineEvent);

export default router;
