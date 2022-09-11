import {Schema, model} from "mongoose";
import {CartModel} from "./cart.model";


const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    items: {
        type: [],
        ref:"cart"
    },
    status: {
        type: String,
        enum: ["Confirmed", "Pending", "Cancelled"],
        default:"Confirmed"
    },
    total: {
        type: Number,
        default: 0,
    }
}, {timestamps: true})

const OrderModel = model('order', orderSchema);

export {OrderModel}