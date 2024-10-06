const express = require("express");
const updateController = require("../controllers/updateController");

const router = express.Router();

router.get("/checkUpdate", updateController.checkUpdate);

module.exports = router;
