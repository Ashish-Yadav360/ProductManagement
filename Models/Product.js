import mongoose from "mongoose";
import Warehouse from "./Warehouse.js";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
    },
    description:{
        type:String,
    },
    stock:[{type:Number}],
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
    WarehouseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Warehouse'
    }
})
productSchema.index({ location: "2dsphere" });
const Product = mongoose.model('Product',productSchema);

export default Product;