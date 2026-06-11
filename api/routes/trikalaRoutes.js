import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimiter.js";
import {
  submitReading,
  getAllReadings,
  getReadingById,
  updateReadingStatus,
} from "../controllers/trikalaController.js";

const router = Router();

const readingRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ min: 2, max: 120 }),
  body("mobile").trim().notEmpty().withMessage("Mobile number is required").matches(/^[0-9]{10}$/).withMessage("Enter a valid 10-digit mobile number"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address"),
  body("gender").trim().notEmpty().withMessage("Gender is required"),
  body("occupation").trim().notEmpty().withMessage("Occupation is required").isLength({ min: 2, max: 120 }),
  body("dob").trim().notEmpty().withMessage("Date of birth is required"),
  body("pob").trim().notEmpty().withMessage("Place of birth is required").isLength({ min: 2, max: 255 }),
  body("serviceType").trim().notEmpty().withMessage("Service type is required").isIn(["horoscope", "ashta_rekha"]).withMessage("Invalid service type"),
  body("guidanceQuery").trim().notEmpty().withMessage("Guidance query is required").isLength({ min: 5, max: 2000 }).withMessage("Please describe your query in at least 5 characters"),
  body("tob").optional({ checkFalsy: true }).trim(),
  body("palmImage").optional({ checkFalsy: true }).isString(),
];

/* Public — form submission */
router.post("/", formLimiter, validate(readingRules), submitReading);

/* Admin — read */
router.get("/",    getAllReadings);
router.get("/:id", getReadingById);

/* Admin — status update */
router.patch(
  "/:id/status",
  validate([body("status").notEmpty().withMessage("Status is required")]),
  updateReadingStatus
);

export default router;
