import { Router } from 'express';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';
import cloudinary,{cloudinaryReady} from '../config/cloudinary.js';
const router=Router();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1},fileFilter:(_req,file,cb)=>cb(null,['image/jpeg','image/png','image/webp'].includes(file.mimetype))});
router.post('/',protect,upload.single('image'),async(req,res,next)=>{
  if(!req.file)return res.status(400).json({message:'Choose a JPG, PNG or WebP image using the “image” field.'});
  if(!cloudinaryReady())return res.status(503).json({message:'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env. You can still add a public image URL in the product form.'});
  try {
    const result=await new Promise((resolve,reject)=>{
      const stream=cloudinary.uploader.upload_stream(
        {folder:'aqua-world/products',resource_type:'image'},
        (error,response)=>error?reject(error):resolve(response),
      );
      stream.end(req.file.buffer);
    });
    if(!result?.secure_url||!result.public_id)return res.status(502).json({message:'Cloudinary did not return an image URL. Please try again.'});
    return res.status(201).json({url:result.secure_url,publicId:result.public_id});
  } catch {
    return res.status(502).json({message:'Cloudinary could not upload this image. Check the Cloudinary credentials and connection in server/.env, or use a public image URL in the product form.'});
  }
});
export default router;
