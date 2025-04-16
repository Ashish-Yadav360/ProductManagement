import mongoose from "mongoose";

const userSchema = new  mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
      type:Number,
      required:true,
      unique:true
    },
    password:{
         type:String,
         required:true
    },
    status: { 
        type: String, 
        enum: ['blocked', 'active', 'approved', 'rejected'],
        default: 'blocked' 
    },
    location: { 
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{timestamps:true})
userSchema.index({ location: "2dsphere" });
const User = mongoose.model('User',userSchema);

export default User;