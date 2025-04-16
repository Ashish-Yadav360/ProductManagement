import mongoose from "mongoose";
const warehouseSchema = new mongoose.Schema({
    warehouseName: { type: String, required: true },
    stock: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }]
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;