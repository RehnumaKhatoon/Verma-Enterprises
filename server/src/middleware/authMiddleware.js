import jwt from 'jsonwebtoken';
export default function protect(req,res,next){const header=req.headers.authorization;if(!header?.startsWith('Bearer '))return res.status(401).json({message:'Sign in to continue'});try{req.admin=jwt.verify(header.slice(7),process.env.JWT_SECRET);next()}catch{return res.status(401).json({message:'Your session has expired. Please sign in again.'})}}
