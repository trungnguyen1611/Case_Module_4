import express from "express";
const mainRouter = express.Router();

import {checkAdminPermission, verifyJWT} from '../middleware/auth'
import multer from 'multer';

import MainController from "../controller/mainController"

const controller=new MainController();

const upload = multer();


mainRouter.route("/")
    .get(controller.loadHomePage)

mainRouter.route("/cart/delete")
    .get(controller.deleteProductInCart)

mainRouter.route("/cart/add")
    .get(controller.addProductIntoCart)

mainRouter.route("/product/detail/")
    .get(controller.showDetailProduct)

mainRouter.route("/product/list/")
    .get(controller.showListProduct)

mainRouter.route("/order/add")
    .get(controller.confirmOrder)


mainRouter.get('/error', function (req, res, next) {
    const err = new Error('Internal Server Error')
    res.status(500)
    res.json(err)
    next(err)
})

export default mainRouter;