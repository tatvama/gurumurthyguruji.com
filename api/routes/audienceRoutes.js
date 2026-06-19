import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimiter.js";
import { requireRole } from "../middleware/requireAuth.js";
import { submitBooking, getAllBookings, getBookingById, updateBookingStatus, getBookingComments, addBookingComment, deleteBookingComment } from "../controllers/audienceController.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");

const router = Router();

const bookingRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),
  body("mobile").trim().notEmpty().withMessage("Mobile number is required").matches(/^[0-9+\-\s]{10,20}$/).withMessage("Enter a valid mobile number"),
  body("email").optional({ checkFalsy: true }).trim().isEmail().withMessage("Enter a valid email address"),
  body("profession").trim().notEmpty().withMessage("Profession is required").isLength({ min: 2, max: 120 }).withMessage("Profession must be 2–120 characters"),
  body("city").trim().notEmpty().withMessage("City is required").isLength({ min: 2, max: 120 }),
  body("district").trim().notEmpty().withMessage("District is required").isLength({ min: 2, max: 120 }),
  body("state").trim().notEmpty().withMessage("State is required").isLength({ min: 2, max: 120 }),
  body("location").optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body("howKnown").trim().notEmpty().withMessage("This field is required").isLength({ min: 2, max: 255 }),
  body("nearestAshram").trim().notEmpty().withMessage("Please select a nearest ashram"),
  body("message").optional({ checkFalsy: true }).trim().isLength({ max: 2000 }).withMessage("Message must be under 2000 characters"),
  body("photo").optional({ checkFalsy: true }).isString(),
];

router.post("/", formLimiter, validate(bookingRules), submitBooking);
router.get("/",    ALL_ADMIN,   getAllBookings);
router.get("/:id", ALL_ADMIN,   getBookingById);
router.patch("/:id/status", ADMIN_SUPER, validate([body("status").notEmpty().withMessage("Status is required")]), updateBookingStatus);
router.get("/:id/comments",              ALL_ADMIN,   getBookingComments);
router.post("/:id/comments",             ALL_ADMIN,   addBookingComment);
router.delete("/:id/comments/:commentId", ADMIN_SUPER, deleteBookingComment);

export default router;
