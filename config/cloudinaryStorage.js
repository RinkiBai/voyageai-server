// config/cloudinaryStorage.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'voyageai_profile_pics',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export default storage;
