import {asyncWrapper} from "../middleware/async";
import {OTP_schema, UserModel} from "../schemas/user.model";

const nodemailer = require('nodemailer');
import bcrypt from "bcrypt"

export const loadForgetPasswordPage = asyncWrapper(async (req, res, next) => {
    let content = {
        title: 'Forget Password',
        username: req.user ? req.user.username :"Not Login",
        role:"",
    }
    res.render("user_forget_password",content)
})

export const revieceOPT = asyncWrapper(async (req, res, next) => {
    const currentOTP = await OTP_schema.findOne({_id: req.body.otpId})
    if (!currentOTP) {
        throw new Error("No OTP found")
    }
    // @ts-ignore
    const isPasswordCorrect = await currentOTP.comparePassword(req.body.otp);
    if (isPasswordCorrect) {
        const salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
        let result = await UserModel.findOneAndUpdate({_id: currentOTP.user_id}, {password: hashedPassword});
        res.redirect('/')
    } else {
        let content = {
            title: 'Password changing',
            message: 'Wrong OTP password!',
            email: req.body.email,
            optID: req.body.otpID,
            username:"Not Login",
            role:""
        }
        res.render("user_forget_password_with_otp",content);
    }
})


export const revieceEmail = asyncWrapper(async (req, res, next) => {
    const recoverEmail: string = req.body.reset_email
    let currentUser: object = await UserModel.findOne({email: recoverEmail})
    if (currentUser) {
        const OTP = Math.floor(Math.random() * 900000 + 100000);
        console.log(OTP);
        // @ts-ignore
        let newOPT = new OTP_schema({user_id: currentUser._id, otp: OTP, email: currentUser.email})
        newOPT.save().then(result => {
            sendEmailToUser(recoverEmail, currentUser, OTP);
            let content = { title: 'Password changing',
                message: "",
                email: recoverEmail,
                optID: newOPT._id,
                username: "Not Login",
                role:""
            }
            res.render("user_forget_password_with_otp", content)
        }).catch((error) => {
            console.log(error.message)
        })
    }
})


export function sendEmailToUser(recoverEmail, currentUser, OTP) {

    console.log('Credentials obtained, sending message...');
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,//587
        auth: {
            user: process.env.MAILING_LIST,
            pass: process.env.MAILING_LIST_PASS
        }
    });

    // Message object
    let message = {
        from: 'Ludus team<teamludus@ludus.com>',
        to: recoverEmail,
        subject: 'Password Recovering',
        html: `<p><b>Hello ${currentUser.username}!</b></p> <br>
                        Your reset password OTP is :<b> ${OTP}</b> <br>
                        Please do not disclose this OTP to anyone else.`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return
        }
        console.log('Message sent: %s', info.messageId);
    });
}


