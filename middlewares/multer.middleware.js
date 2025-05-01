import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 99);
        cb(null, uniqueSuffix + '-' + (file.originalname.split(" ").join("")));
    }
});

const upload = multer({ storage: storage })

export default upload;