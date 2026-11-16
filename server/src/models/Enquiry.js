import mongoose from 'mongoose';

const enquirySchema=new mongoose.Schema({
  name:{type:String,required:true,trim:true,minlength:2,maxlength:100},
  email:{type:String,required:true,trim:true,lowercase:true,maxlength:254},
  phone:{type:String,trim:true,maxlength:40,default:''},
  message:{type:String,required:true,trim:true,minlength:10,maxlength:2000},
  status:{type:String,enum:['new','contacted','closed'],default:'new',index:true},
},{timestamps:true});

export default mongoose.model('Enquiry',enquirySchema);
