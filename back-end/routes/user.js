const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { check, validationResult } = require("express-validator");
router.post(
  "/signup",
  [
    check("email")
      .exists()
      .isLength({ min: 3 })
      .withMessage("invalid email address")
      .normalizeEmail(),

    check("password")
      .isLength({ min: 1, max: 15 })
      .withMessage("your password should have min and max length between 1-15")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character"),
  ],
  (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !error.isEmpty();

    if (hasError) {
      res.status(422).json({ error: error.array() });
    } else {
      next();
    }
  },
  userCtrl.signup
); //on peut envoyer un login vide revoir
router.post("/login", userCtrl.login); //expression réguliere. Package de validation de données

module.exports = router;
