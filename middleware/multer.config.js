const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images'),
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico);
    }
});

const fileFilter = (req, file, cb) => {
    // PNG, JPG, JPEG
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    const permitidos = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (permitidos.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imagenes .jpg, .jpeg, .png, .gif, .webp"));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2 MB
});

module.exports = upload;