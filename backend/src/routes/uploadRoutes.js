const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const uploadController = require("../controllers/uploadController");
router.post(
    "/",
    upload.array("documentos", 20),
    uploadController.upload
);
module.exports = router;