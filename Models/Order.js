import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status: { type: String, 
    enum: ['pending', 'accepted', 'rejected'],
     default: 'pending' 
    },
    orderDate:{type:Date, default:Date.now()}

})

const Order = mongoose.model('Order',orderSchema);

export default Order;