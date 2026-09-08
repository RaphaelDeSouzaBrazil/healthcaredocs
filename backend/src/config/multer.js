const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname);
        cb(null, `${randomUUID()}${extensao}`);
    }
});

module.exports = multer({
    storage,

    fileFilter(req, file, cb) {

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "application/pdf"
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(new Error("Tipo de arquivo não permitido"));
        }

        cb(null, true);
    },

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

