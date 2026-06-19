import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimiter.js";
import { requireRole } from "../middleware/requireAuth.js";
import { submitContact, getAllContacts, getContactById, convertToDevotee } from "../controllers/contactController.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");

const router = Router();

const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ min: 2, max: 200 }).withMessage("Subject must be 2–200 characters"),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ min: 3, max: 5000 }).withMessage("Message must be at least 3 characters"),
];

router.post("/", formLimiter, validate(contactRules), submitContact);
router.get("/",                         ALL_ADMIN,   getAllContacts);
router.get("/:id",                      ALL_ADMIN,   getContactById);
router.post("/:id/convert-to-devotee", ADMIN_SUPER, convertToDevotee);

export default router;
