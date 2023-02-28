const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");
// const Sauce = require("../models/Sauce");

router.post("/", auth, multer, sauceCtrl.createSauce);

router.put("/:id", auth, sauceCtrl.modifySauce);

router.delete("/:id", auth, sauceCtrl.deleteSauce);

router.get("/:id", auth, sauceCtrl.getOneSauce);

router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;