import {asyncWrapper} from "../middleware/async";
import {OTP_schema, UserModel} from "../schemas/user.model";
import {logout} from "./authController";
import {OrderModel} from "../schemas/order.model";
import {ProductModel} from "../schemas/product.model";
import {CartModel} from "../schemas/cart.model";
import {sendEmailToUser} from "./forgetPasswordController";

export const loadUserProfile = asyncWrapper(async (req, res, next) => {
    const currentUser = await UserModel.findOne({_id: req.user.id})
    const listCart = await CartModel.find({owner:req.user.id});
    const amountCart = listCart.length;
    let sum = 0;
    for (let i = 0; i < listCart.length; i++) {
        sum += listCart[i].price;
    }
    let content = {
        title: req.user.username,
        username: req.user.username,
        user: currentUser,
        listCart:listCart,
        amountCart:amountCart,
        sum:sum,
        role:req.user
    }
    res.render('user_profile', content)
})


export const loadUserEditProfile = asyncWrapper(async (req, res, next) => {
    const currentUser = await UserModel.findOne({_id: req.user.id})
    const listCart = await CartModel.find({owner:req.user.id});
    const amountCart = listCart.length;
    let sum = 0;
    for (let i = 0; i < listCart.length; i++) {
        sum += listCart[i].price;
    }
    let content = {
        title: req.user.username,
        user: currentUser,
        username:req.user.username,
        listCart:listCart,
        amountCart:amountCart,
        sum:sum,
        role:req.user
    }
    res.render('user_edit_profile', content)
})

export const editProfileRequestHandler = asyncWrapper(async (req, res, next) => {
    let {username,DOB,email,phone,address, gender} = req.body
    let editingData = {username,DOB,email,phone,address, gender}
    await UserModel.findOneAndUpdate({_id: req.user.id}, editingData)
    return res.redirect('/user/profile')
})
export const loadUsersOrderPage = asyncWrapper(async (req, res, next) => {
    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 3;
    let listOrder = await OrderModel
        .find({user: req.user.id})
        .limit(limit)
        .skip(page * 3);
    let orders = await OrderModel.find({user:req.user.id});
    let countOrders=orders.length;
    const listCart = await CartModel.find({owner:req.user.id});
    const amountCart = listCart.length;
    let sum = 0;
    for (let i = 0; i < listCart.length; i++) {
        sum += listCart[i].price;
    }
    let content = {
        title: 'My Order',
        listOrder: listOrder,
        totalOrders: countOrders,
        user: {name: req.user.name},
        username: req.user.username,
        listCart:listCart,
        amountCart:amountCart,
        sum:sum,
        role:req.user
    }
    res.render('user_order', content)
})


export const loadUserDetailOrderPage = asyncWrapper(async (req, res, next) => {
    let orderId = req.query.order_id ? req.query.order_id : "";
    let detailOrder = await OrderModel
        .find({_id: orderId});

    const listCart = await CartModel.find({owner:req.user.id});
    const amountCart = listCart.length;
    let sum = 0;
    for (let i = 0; i < listCart.length; i++) {
        sum += listCart[i].price;
    }
    let content = {
        title: 'Detail Order ',
        username: req.user.username,
        detailOrder: detailOrder,
        listCart:listCart,
        amountCart:amountCart,
        sum:sum,
        role:req.user
    }
    res.render('user_order_detail', content)
})

export const changePassword=asyncWrapper(async(req,res,next)=> {
    let currentUser = await UserModel.findOne({_id: req.user.id})
    if (currentUser) {
        const OTP = Math.floor(Math.random() * 900000 + 100000);
        console.log(OTP);
        // @ts-ignore
        let newOPT = new OTP_schema({user_id: currentUser._id, otp: OTP, email: currentUser.email})
        newOPT.save().then(result => {
            sendEmailToUser(currentUser.email, currentUser, OTP);
            let content = {
                title: 'Password changing',
                message: "",
                email: currentUser.email,
                optID: newOPT._id,
                username: req.user ? req.user.username : "Not Login",
                role: ""
            }
            res.render("user_forget_password_with_otp", content)
        })
    }
})
