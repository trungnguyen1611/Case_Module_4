import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import {StatusCodes} from "http-status-codes"


dotenv.config()

export const verifyJWT = (req, res, next) => {
    const cookie = req.headers.cookie;
    const arrayCookie = cookie.split(';');
    if (!cookie) {
        return res.redirect('/auth/login');
    } else {
        if (!cookie.match('token')) {
            return res.redirect('/auth/login');
        } else {
            arrayCookie.forEach((value) => {
                if (value.match('token')) {
                    const accessToken = value.split("=")[1];
                    jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY, (err, user) => {
                        if (err) {
                            return res.redirect('/auth/login');
                        } else {
                            req.user = user;
                            return next();
                        }
                    })
                }
            })
        }
    }
}


export const checkAdminPermission = (req, res, next) => {
    if (req.user.admin) {
        next()
    } else {
        res.redirect('/user/profile')
    }
}