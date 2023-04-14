const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname,process.env.UPLOAD_DIR),
  filename: (req, file, cb) =>{
    const extension = path.extname(file.originalname);
    const randomNumber = Math.round(Math.random()*1e9);
    const filename = `${file.fieldname}-${Date.now()}-${randomNumber}${extension}`;
    cb(null, filename);
  }, 
});

const fileFilter = (req, file, cb)=>{
  const allowedMimeTypes = ['image/png','image/jpg', 'image/jpeg'];
  if(allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  }else {
    cb(null, false);
  }
};

const multerMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5*1024*1024 },
  fileFilter: fileFilter,
});

module.exports = multerMiddleware;
