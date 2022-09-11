import {Schema,model} from "mongoose";


const categorySchema=new Schema({
    name:{
        type: String,
        required:true,
    }
})

const CategoryModel=model('category',categorySchema);

export {CategoryModel}