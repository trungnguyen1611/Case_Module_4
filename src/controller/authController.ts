import passport from "passport";
import router from "../router/authRouter";
import {asyncWrapper} from "../middleware/async";
import {UserModel} from "../schemas/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {CartModel} from "../schemas/cart.model";

dotenv.config()


function responseWrongEmailOrPassword(res) {
    let content = {
        title: "Login Page",
        username: "Not Login",
        message: 'Wrong email or password!',
        role: ""
    }
    return res.render("signin", content);
}

export const loginByUserOrAdmin = asyncWrapper(async (req, res, next) => {
    const user = await UserModel.findOne({
        email: req.body.email,
    })
    if(!user) return responseWrongEmailOrPassword(res);
    // @ts-ignore
    const isPasswordCorrect = await user.comparePassword(req.body.password);
    if (!isPasswordCorrect) return responseWrongEmailOrPassword(res)

        const payload = {
            username: user.username,
            id: user._id,
            admin: user.admin
        }
        const token = await jwt.sign(payload, process.env.TOKEN_SECRET_KEY);
        res.cookie("token", token,{
            httpOnly:true
        });
        return res.redirect("/");
    }
)


export const loadLoginPage = asyncWrapper( async (req, res,next) => {
    let content = {
        title: "Login Page",
        username:"Not Login",
        message:'',
        role:''
    }
    await res.clearCookie('token');
    return res.render("signin",content);
})


export const logout = asyncWrapper(async(req,res,next)=>{
    await res.clearCookie('token');
    return await res.redirect('/auth/login');
})



//
//
// export const redirectUserToGoogleLogin = asyncWrapper((req, res,next)=> {
//     passport.authenticate('google', {scope: ['profile', 'email']});
// })
//
//
// export const getUserInfoFromGoogle = asyncWrapper((req, res, next)=> {
//     res.send("getUserInfoFromGoogle");
//     passport.authenticate('google', {
//         failureRedirect: '/login'}),
//         (req, res) => {
//             res.send("You are authenticated")
//         };
// })



