import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import {
  getLibrary, createRemedy, updateRemedy, deleteRemedy,
  getCaseRemedies, assignRemedy, updateAssignment, deleteAssignment,
} from "../controllers/remedyController.js";

const router = Router();

/* Library (PRD §12-D) */
router.get("/", getLibrary);
router.post(
  "/",
  validate([
    body("name").trim().notEmpty().withMessage("Remedy name is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
  ]),
  createRemedy
);
router.patch("/:id", updateRemedy);
router.delete("/:id", deleteRemedy);

/* Case assignments (PRD §3 Stage 4) */
router.get("/case/:caseRef", getCaseRemedies);
router.post(
  "/case/:caseRef",
  validate([body("remedy_name").trim().notEmpty().withMessage("Remedy name is required")]),
  assignRemedy
);
router.patch("/assignment/:id", updateAssignment);
router.delete("/assignment/:id", deleteAssignment);

export default router;
