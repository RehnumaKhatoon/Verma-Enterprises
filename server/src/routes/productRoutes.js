import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import protect from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';
const router=Router();
const productFields=['name','category','subcategory','price','isSamplePrice','description','images','stock','isAvailable','isFeatured'];
function cleanInput(body){const out={};for(const field of productFields)if(body[field]!==undefined)out[field]=body[field];if(out.category==='aquarium product')out.category='aquarium';return out}
router.get('/',async(req,res,next)=>{try{const query={};if(['fish','plants','aquarium'].includes(req.query.category))query.category=req.query.category;if(req.query.featured==='true')query.isFeatured=true;if(req.query.available==='true')query.isAvailable=true;const products=await Product.find(query).sort({isFeatured:-1,createdAt:-1});res.json(products)}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{const query=mongoose.isValidObjectId(req.params.id)?{_id:req.params.id}:{slug:req.params.id};const product=await Product.findOne(query);if(!product)return res.status(404).json({message:'Product not found'});res.json(product)}catch(e){next(e)}});
router.post('/',protect,async(req,res,next)=>{try{const product=await Product.create(cleanInput(req.body));res.status(201).json(product)}catch(e){next(e)}});
router.put('/:id',protect,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid product id'});const product=await Product.findByIdAndUpdate(req.params.id,cleanInput(req.body),{new:true,runValidators:true});if(!product)return res.status(404).json({message:'Product not found'});res.json(product)}catch(e){next(e)}});
router.delete('/:id',protect,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid product id'});const product=await Product.findByIdAndDelete(req.params.id);if(!product)return res.status(404).json({message:'Product not found'});const ids=product.images.map(i=>i.publicId).filter(Boolean);if(ids.length)await Promise.allSettled(ids.map(id=>cloudinary.uploader.destroy(id)));res.json({message:'Product removed'})}catch(e){next(e)}});
export default router;
