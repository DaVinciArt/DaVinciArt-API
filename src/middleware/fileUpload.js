import multer  from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const filename = 'newImage-' + Date.now() + fileExt;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

export const uploadSingle = upload.single('avatar');
export const uploadAny = upload.any()