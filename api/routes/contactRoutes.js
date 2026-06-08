import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimiter.js";
import { submitContact, getAllContacts, getContactById } from "../controllers/contactController.js";

const router = Router();

const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ min: 2, max: 200 }).withMessage("Subject must be 2–200 characters"),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ min: 3, max: 5000 }).withMessage("Message must be at least 3 characters"),
];

router.post("/", formLimiter, validate(contactRules), submitContact);
router.get("/", getAllContacts);
router.get("/:id", getContactById);

export default router;
