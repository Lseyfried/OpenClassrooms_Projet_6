const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { checkEmail, validationEmail } = require("../middleware/checkEmail");

router.post("/signup", checkEmail, validationEmail, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
