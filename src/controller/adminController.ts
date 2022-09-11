import {asyncWrapper} from "../middleware/async";
import {ProductModel} from "../schemas/product.model";
import {CartModel} from "../schemas/cart.model";
import {UserModel} from "../schemas/user.model";
import {OrderModel} from "../schemas/order.model";
import {CategoryModel} from "../schemas/category.model";
import multer from "multer";
import appRoot from "app-root-path"


class AdminController {
    constructor() {
    }

    loadAdminPage = asyncWrapper(async (req, res) => {
        const products = await ProductModel.find();
        const orders = await OrderModel.find().populate('user');
        const listCart = await CartModel.find({owner:req.user.id});
        const amountCart = listCart.length;
        let sum = 0;
        for (let i = 0; i < listCart.length; i++) {
            sum += listCart[i].price;
        }
        const accounts = await UserModel.find();
        const content = {
            title: 'Admin Page',
            username: req.user.username,
            listCart: listCart,
            amountCart: amountCart,
            products: products,
            sum: sum,
            accounts: accounts,
            orders: orders,
            role:req.user
        }
        res.render("admin_dashboard", content);
    })

    addProduct = asyncWrapper(async (req, res, next) => {
        req.body.images=[];
        req.files.forEach(value=>{
            req.body.images.push(`/uploads/${value.filename}`)
        })
        const product = new ProductModel({
            name:req.body.name,
            price:req.body.price,
            category:req.body.category,
            description:req.body.description,
            sale:req.body.sale,
            images:req.body.images,
            salePrice:Math.ceil(req.body.price-(req.body.price*req.body.sale/100))
        });
        await ProductModel.create(product).catch(() => {
            res.redirect('/admin/product/create');
        }).then(() => {
            res.redirect('/admin/dashboard');
        })
    })

    loadProductCreatePage = asyncWrapper(async (req, res) => {
        const category = await CategoryModel.find();
        const listCart = await CartModel.find({owner:req.user.id});
        const amountCart = listCart.length;
        let sum = 0;
        for (let i = 0; i < listCart.length; i++) {
            sum += listCart[i].price;
        }
        let content = {
            title: "Create Product",
            category: category,
            username: req.user.username,
            listCart:listCart,
            amountCart:amountCart,
            sum:sum,
            role:req.user
        }
        return res.render("product_create", content);
    })

    deleteProduct = asyncWrapper(async (req, res, next) => {
        await ProductModel.findOneAndDelete({
            _id: req.query.id
        })
        return res.redirect("/admin/dashboard")
    })

    loadProductEditPage = asyncWrapper(async (req, res, next) => {
        const product = await ProductModel.findOne({
            _id: req.query.id
        })
        const category = await CategoryModel.find();
        const listCart = await CartModel.find({owner:req.user.id});
        const amountCart = listCart.length;
        let sum = 0;
        for (let i = 0; i < listCart.length; i++) {
            sum += listCart[i].price;
        }
        const content = {
            title:"Edit Product",
            product: product,
            category:category,
            username: req.user.username,
            listCart:listCart,
            amountCart:amountCart,
            sum:sum,
            role:req.user
        }
        return res.render("product_edit", content)
    })

    editProduct = asyncWrapper(async (req, res, next) => {
        req.body.images=[];
        req.files.forEach(value=>{
            req.body.images.push(`/uploads/${value.filename}`)
        })
        if(req.body.delete_image){
            await ProductModel.updateOne({
                _id: req.query.id
            }, {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description,
                sale: req.body.sale,
                images:req.body.images,
                salePrice:Math.ceil(req.body.price-(req.body.price*req.body.sale/100))
            }).catch(err=>{
                console.log(err)
            })
        }else{
            await ProductModel.updateOne({
                _id: req.query.id
            }, {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description,
                sale: req.body.sale,
                $push:{images:req.body.images},
                salePrice:Math.ceil(req.body.price-(req.body.price*req.body.sale/100))
            }).catch(err=>{
                console.log(err)
            })
        }
        return res.redirect('/admin/dashboard');
    })

}

export default AdminController;