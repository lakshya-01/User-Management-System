import { Router } from "express";
import { body, validationResult } from "express-validator";
import * as userController from "../controllers/userController";

const router = Router();

const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/users",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone must be 10 digits")
      .isNumeric().withMessage("Phone must be numeric"),
    body("gender").isIn(["Male", "Female", "Others"]).withMessage("Gender must be Male, Female, or Others"),
    body("status").optional().isIn(["Active", "Inactive"]).withMessage("Status must be Active or Inactive")
  ],
  handleValidationErrors,
  userController.createUser
);

router.put(
  "/users/:id",
  [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("phone").optional().isNumeric().isLength({ min: 10, max: 10 }).withMessage("Phone must be 10 numeric digits"),
    body("gender").optional().isIn(["Male", "Female", "Others"]).withMessage("Gender must be Male, Female, or Others"),
    body("status").optional().isIn(["Active", "Inactive"]).withMessage("Status must be Active or Inactive")
  ],
  handleValidationErrors,
  userController.updateUser
);

router.delete("/users/:id", userController.deleteUser);
router.get("/users", userController.listUsers);

export default router;
