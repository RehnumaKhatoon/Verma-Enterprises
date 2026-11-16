import './loadEnv.js';
import { v2 as cloudinary } from 'cloudinary';

const configuration = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
};

cloudinary.config(configuration);

export const cloudinaryReady = () => Boolean(
  configuration.cloud_name && configuration.api_key && configuration.api_secret,
);
export default cloudinary;
