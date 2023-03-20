const { check, validationResult } = require("express-validator");

const checkEmail = [
  check("email")
    .exists()
    .isEmail()
    .withMessage("adresse email invalide")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 1, max: 15 })
    .withMessage(
      "Votre mot de passe doit avoir une longueur minimum et maximum entre 1 et 15 caractères"
    )
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Votre mot de passe doit contenir au moins un caractère spécial"
    ),
];
const validationEmail = (req, res, next) => {
  const error = validationResult(req).formatWith(({ msg }) => msg);

  const hasError = !error.isEmpty();

  if (hasError) {
    res.status(422).json({ error: error.array() });
  } else {
    next();
  }
};

module.exports = { checkEmail, validationEmail };
