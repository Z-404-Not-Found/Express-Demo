const express = require("express");
const uploadController = require("../controllers/uploadController");
var multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./uploads");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        },
    }),
});

router.post(
    "/uploadImageToBed",
    upload.single("image"),
    uploadController.uploadImageToBed
);
router.post(
    "/uploadImageToMinIO",
    upload.single("image"),
    uploadController.uploadImageToMinIO
);

module.exports = router;
