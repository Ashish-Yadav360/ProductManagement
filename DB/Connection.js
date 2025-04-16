import mongoose from "mongoose";

const connectMongoDb = async(req,res)=>{
     try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Db connected');
     } catch (error) {
        console.log(error);
     }
}

export default connectMongoDb;