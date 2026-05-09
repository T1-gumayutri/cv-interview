const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directories exist
const cvsDir = path.join(__dirname, '../uploads/cvs');
const audioDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(cvsDir)) {
  fs.mkdirSync(cvsDir, { recursive: true });
}
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, cvsDir);
    } else if (file.mimetype.startsWith('audio/')) {
      cb(null, audioDir);
    } else if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm') {
      // Safari might record audio as video containers
      cb(null, audioDir);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Safari MediaRecorder might send audio as .mp4 or without extension
    let ext = path.extname(file.originalname);
    if (!ext) {
       if (file.mimetype.includes('mp4')) ext = '.mp4';
       else if (file.mimetype.includes('webm')) ext = '.webm';
       else ext = '.audio';
    }
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' || 
    file.mimetype.startsWith('audio/') ||
    file.mimetype === 'video/mp4' || 
    file.mimetype === 'video/webm'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF or Audio files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // Increased to 50MB for audio
});

module.exports = upload;
