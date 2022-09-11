import {UserModel} from "../schemas/user.model";
import {asyncWrapper} from "../middleware/async";

export const register = asyncWrapper(async (req, res, next) => {
    const user = new UserModel(req.body);
    await user.save().then(() => {
        console.log('Tao tai khoan thanh cong')
        return res.redirect("/auth/login");
    }).catch(() => {
        let content = {
            title: 'Registered',
            message: 'Email đã tồn tại !',
            username:"Not Login",
            role:""
        }
        return res.render("signup", content)
    })
})

export const loadRegisterPage = (req, res, next) => {
    let content = {
        title: 'Registered',
        message: "",
        username:"Not Login",
        role:""
    }
    return res.render("signup", content);
}