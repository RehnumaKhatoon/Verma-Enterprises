import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Enquiry from '../models/Enquiry.js';
import protect from '../middleware/authMiddleware.js';

const router=Router();
const submitLimit=rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:true,legacyHeaders:false,message:{message:'Too many enquiries were sent. Please try again shortly.'}});

router.post('/',submitLimit,async(req,res,next)=>{
  try{
    const {name,email,message}=req.body||{};
    const phone=typeof req.body?.phone==='string'?req.body.phone.trim():'';
    if(typeof name!=='string'||typeof email!=='string'||typeof message!=='string')return res.status(400).json({message:'Name, email, and message are required.'});
    const normalizedEmail=email.trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))return res.status(400).json({message:'Enter a valid email address.'});
    const enquiry=await Enquiry.create({name,email:normalizedEmail,phone,message});
    res.status(201).json({message:'Your enquiry has been sent. We’ll be in touch soon.',id:enquiry._id});
  }catch(error){next(error)}
});

router.get('/',protect,async(_req,res,next)=>{try{res.json(await Enquiry.find().sort({createdAt:-1}).limit(500))}catch(error){next(error)}});
router.patch('/:id',protect,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid enquiry id'});if(!['new','contacted','closed'].includes(req.body.status))return res.status(400).json({message:'Choose a valid enquiry status.'});const enquiry=await Enquiry.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true});if(!enquiry)return res.status(404).json({message:'Enquiry not found'});res.json(enquiry)}catch(error){next(error)}});
router.delete('/:id',protect,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid enquiry id'});const enquiry=await Enquiry.findByIdAndDelete(req.params.id);if(!enquiry)return res.status(404).json({message:'Enquiry not found'});res.json({message:'Enquiry removed.'})}catch(error){next(error)}});

export default router;
