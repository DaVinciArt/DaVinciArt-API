/*import multer  from 'multer'

const storage = multer.diskStorage({
    destination: function (req, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, cb) {
        cb(null, req.file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

module.exports = {
    uploadSingle: upload.single('image'),
};*/