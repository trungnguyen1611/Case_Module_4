import express from "express";
const userRouter = express.Router();
import passport from "passport";

import {
    loadUserProfile,
    loadUserEditProfile,
    editProfileRequestHandler,
    loadUsersOrderPage,
    loadUserDetailOrderPage, changePassword
} from "../controller/userController"
import mainRouter from "./mainRouter";


userRouter.route("/profile")
    .get(loadUserProfile)


userRouter.route("/edit-profile")
    .get(loadUserEditProfile)
    .post(editProfileRequestHandler)

userRouter.route("/my-order")
    .get(loadUsersOrderPage)


userRouter.route("/my-order/detail")
    .get(loadUserDetailOrderPage)

userRouter.route("/change-password")
    .get(changePassword)



export default userRouter;
