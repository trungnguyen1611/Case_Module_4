import {ProductModel} from "../schemas/product.model";
import {UserModel} from "../schemas/user.model";
import bcrypt from 'bcrypt';
import multer from 'multer';
import {asyncWrapper} from "../middleware/async";
import jwt from "jsonwebtoken"
import {CategoryModel} from "../schemas/category.model";
import {CartModel} from "../schemas/cart.model";
import {verifyJWT} from "../middleware/auth";
import {OrderModel} from "../schemas/order.model";

const upload = multer();

class MainController {
    constructor() {
    }

    loadHomePage = asyncWrapper(async (req, res, next) => {
        const listProduct = await ProductModel.find().limit(8).skip(0);
        const topCombo = await ProductModel.find().limit(4).sort('-price');
        const saleOff = await ProductModel.find().limit(4).sort('-sale');
        const special = await ProductModel.find().limit(2).sort('-price');
        const weekly = await ProductModel.find().limit(3).sort('name');
        const flash = await ProductModel.find().limit(3).sort('-name');
        const listCart = await CartModel.find({owner: req.user.id});
        const amountCart = listCart.length;
        let sum = 0;
        for (let i = 0; i < listCart.length; i++) {
            sum += listCart[i].price;
        }
        const content = {
            title: 'Home Page',
            username: req.user.username,
            listCart: listCart,
            amountCart: amountCart,
            listProducts: listProduct,
            sum: sum,
            role: req.user,
            topCombo: topCombo,
            special: special,
            saleOff:saleOff,
            weekly:weekly,
            flash:flash
        }
        return res.render('index', content)
    })

    addProductIntoCart = asyncWrapper(async (req, res, next) => {
        const product = await ProductModel.findOne({
            _id: req.query.id
        });
        const cart = new CartModel({
            owner: req.user.id,
            name: product.name,
            username: req.user.username,
            price: product.salePrice,
            category: product.category,
            description: product.description
        });
        await cart.save();
        await UserModel.updateOne({_id: req.user.id}, {$push: {cart: cart._id}});
        return res.redirect("/product/list")
    })

    showDetailProduct = asyncWrapper(async (req, res, next) => {
        let currentProduct = await ProductModel.findOne({_id: req.query._id});
        const listCart = await CartModel.find({owner: req.user.id});
        const amountCart = listCart.length;
        let sum = 0;
        for (let i = 0; i < listCart.length; i++) {
            sum += listCart[i].price;
        }
        let content = {
            title: currentProduct.name,
            username: req.user.username,
            product: currentProduct,
            listCart: listCart,
            amountCart: amountCart,
            sum: sum,
            role: req.user
        }
        res.render("product_detail", content)
    })

    showListProduct = asyncWrapper(async (req, res, next) => {
        let page = req.query.page ? req.query.page : 0;
        let limit = req.query.limit ? req.query.limit : 8;
        let search = req.query.search ? req.query.search : "";
        let regex = new RegExp(search, 'i')
        let countProduct = await ProductModel.countDocuments();
        const listCart = await CartModel.find({owner: req.user.id});
        const amountCart = listCart.length;
        let sum = 0;
        for (let i = 0; i < listCart.length; i++) {
            sum += listCart[i].price;
        }
        const accounts = await UserModel.find();
        let listProducts = await ProductModel
            .find()
            .or([
                {name: regex},
                {category: regex},
                {description: regex},
            ])
            .limit(limit)
            .skip(page * 8)
        let content = {
            title: req.query.search ? "Searching..." + req.query.search : 'Product List',
            listProduct: listProducts,
            TotalProduct: countProduct,
            username: req.user.username,
            amountCart: amountCart,
            accounts: accounts,
            sum: sum,
            listCart: listCart,
            role: req.user
        }
        res.render('product_list', content)
    })

    deleteProductInCart = asyncWrapper(async (req, res, next) => {
        await CartModel.findOneAndDelete({
            _id: req.query.id
        })
        return res.redirect("/")
    })

    confirmOrder = asyncWrapper(async (req, res, next) => {
        const user = await UserModel.findById(req.user.id);
        const items = await CartModel.find({owner:req.user.id});
        let total = 0;
        await items.forEach(value => {
            total += value.price;
        })
        const order = new OrderModel({user: user, items: items, total: total});
        await order.save();
        await UserModel.updateOne({_id: req.user.id}, {$push: {orders: order._id}});
        await CartModel.deleteMany({owner: req.user.id});
        await UserModel.updateOne({_id: req.user.id}, {$set: {cart: []}});
        return res.redirect('/user/my-order');
    })

}


export default MainController;
