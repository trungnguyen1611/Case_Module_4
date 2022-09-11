import express from "express";

const router = express.Router();
import passport from "passport";
// import passport from "../middleware/passport";

import multer from 'multer';
import {
    loginByUserOrAdmin,
    loadLoginPage,
    logout,
} from "../controller/authController"

const upload = multer();

router.route("/login")
    .get(loadLoginPage)
    .post(upload.none(), loginByUserOrAdmin);

router.route('/logout')
    .get(logout)


// mainRouter.get('/login/google', passport.authenticate('google', {scope: ['profile', 'email']}));
//
// mainRouter.get(
//     "/login/google/callback",
//     passport.authenticate('google'),
//     (req, res) => {
//         res.send("You are authenticated")
//     }
// );


// mainRouter.route('/login/google')
//     .get(redirectUserToGoogleLogin);
//
// mainRouter.route("/google/callback")
//     .get(getUserInfoFromGoogle)

export default router;