import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import expressLayouts from 'express-ejs-layouts';
import authRouter from "./src/router/authRouter";
import mainRouter from "./src/router/mainRouter";
import adminRouter from "./src/router/adminRouter";
import userRouter from "./src/router/userRouter";
import errorToSlack from "express-error-slack"
import dotenv from "dotenv"
import appRoot from "app-root-path";
import * as path from "path";
import registerRouter from "./src/router/registerRouter";
import forgetPasswordRouter from "./src/router/userForgetPasswordRouter";
import {checkAdminPermission, verifyJWT} from "./src/middleware/auth";
import {notFoundPage} from "./src/middleware/not-found";
const app = express();

dotenv.config()

const PORT = process.env.PORT || 3000;

app.set('views', './src/views');
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout','./layouts/layout');

const rootPath=appRoot.path;
let publicPath = path.join(rootPath, "src", "public");
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use("/auth", authRouter);
app.use("/register",registerRouter);
app.use("/forget-password",forgetPasswordRouter);
app.use("/",verifyJWT,mainRouter)
app.use("/user",verifyJWT,userRouter)
app.use("/admin",verifyJWT, checkAdminPermission, adminRouter)

app.use(errorToSlack({ webhookUri: process.env.SLACK_WEB_HOOK_URI  }))
app.use((err,req,res,next)=>{
 let content = {title: "Error", errorMessage: err.message, errorStatus:500,username:"Not Login",role:''}
 res.status(500).render('error',content)
})
app.use(notFoundPage)


mongoose.connect(process.env.MONGODB_URI,()=>{
 console.log("connect success")
})

app.listen(PORT,
    () => console.log(`Server is listening port http://localhost:${PORT}`)
);


