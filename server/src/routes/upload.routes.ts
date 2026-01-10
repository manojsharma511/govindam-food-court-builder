import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

// Configure Cloudinary if credentials exist
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️ Cloudinary configured');
} else {
  console.log('📂 Cloudinary credentials missing, falling back to local storage');
}

// Ensure uploads directory exists for temp/local storage
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Single file upload route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl = '';

    if (useCloudinary) {
      // Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'govindam-food-court',
        });
        imageUrl = result.secure_url;

        // Delete local temp file
        fs.unlinkSync(req.file.path);
      } catch (cloudError) {
        console.error('Cloudinary upload failed:', cloudError);
        return res.status(500).json({ message: 'Cloud upload failed' });
      }
    } else {
      // Use Local URL
      const protocol = req.protocol;
      const host = req.get('host');
      // Note: 'uploads' directory must be served statically in index.ts
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    res.json({
      message: 'File uploaded successfully',
      url: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;
