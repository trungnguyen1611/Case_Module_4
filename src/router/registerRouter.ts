import {register, loadRegisterPage} from "../controller/registerController";
import express from "express";
const router = express.Router();

router.route("/").get(loadRegisterPage).post(register);

export default router;