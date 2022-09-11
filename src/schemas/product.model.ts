import {Schema, model} from "mongoose";
import {CategoryModel} from "./category.model";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        ref:"category"
    },
    description: {
        type: String,
    },
    sale:{
        type:Number
    },
    images:{
        type:[String],
    },
    salePrice:{
        type:Number
    }
})

const ProductModel = model('Product', productSchema);

export {ProductModel};