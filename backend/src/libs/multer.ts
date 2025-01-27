import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'static/uploads',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix)
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Only JPEG and PNG images are allowed!'));
        }
        cb(null, true);
    },
})

export default upload;