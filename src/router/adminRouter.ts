import express from "express";
const adminRouter = express.Router();
import AdminController from "../controller/adminController";
import multer from "multer"
import {ProductModel} from "../schemas/product.model";
import appRoot from "app-root-path"
import * as path from "path";
import {Logger} from "concurrently";
import {logout} from "../controller/authController";

const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname,'../../../src/public', '/uploads'));
    },
    //add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
})


const controller=new AdminController();

adminRouter.route("/dashboard")
    .get(controller.loadAdminPage)

adminRouter.route("/product/create")
    .get(controller.loadProductCreatePage)
    .post(upload.array('images',10),controller.addProduct)



adminRouter.route("/product/delete")
    .get(controller.deleteProduct)

adminRouter.route("/product/edit")
    .get(controller.loadProductEditPage)
    .post(upload.array('images',10),controller.editProduct)


export default adminRouter;
