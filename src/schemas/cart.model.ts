import {Schema, model} from "mongoose";

const cartSchema = new Schema({
    owner:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
    name: {
        type: String,
    },
    category: {
        type: String,
        ref: "category"
    },
    price: {
        type: Number,
    },
    amount: {
        type: Number,
        default: 1
    },
    description: {
        type: String
    }
})

const CartModel = model('cart', cartSchema);

export {CartModel};