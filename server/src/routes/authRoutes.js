import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
const router=Router();
const loginLimit=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false,message:{message:'Too many sign-in attempts. Please try again shortly.'}});
router.post('/login',loginLimit,async(req,res,next)=>{try{const email=String(req.body.email||'').trim().toLowerCase(),password=String(req.body.password||'');if(!email||!password)return res.status(400).json({message:'Email and password are required'});const admin=await Admin.findOne({email}).select('+password');if(!admin||!(await bcrypt.compare(password,admin.password)))return res.status(401).json({message:'Email or password is incorrect'});const token=jwt.sign({id:admin._id,email:admin.email},process.env.JWT_SECRET,{expiresIn:'12h'});res.json({token,admin:{id:admin._id,email:admin.email}})}catch(e){next(e)}});
export default router;
