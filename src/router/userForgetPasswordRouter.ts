import express from "express";
import {
    loadForgetPasswordPage,
    revieceEmail, revieceOPT
} from "../controller/forgetPasswordController";

const router = express.Router();

router.route("/")
    .get(loadForgetPasswordPage)
    .post(revieceEmail);
router.route("/otp")
    .post(revieceOPT);

export default router;