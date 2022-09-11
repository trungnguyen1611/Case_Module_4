import passport from "passport"
import {UserModel} from '../schemas/user.model'
import LocalStrategy from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';

// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local', new LocalStrategy(async (username, password, done) => {
    console.log({username, password});
    const user = await UserModel.findOne({username: username});
    if (!user) {
        return done(null, false);
    } else {
        if (user.password === password) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
}));

passport.use(new GoogleStrategy.OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/login/google/callback",
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            console.log(profile, 'profile')
            let existingUser = await UserModel.findOne({'google.id': profile.id});
            // if user exists return the user
            if (existingUser) {
                return done(null, existingUser);
            }
            // if user does not exist create a new user
            console.log('Creating new user...');
            const newUser = new UserModel({
                google: {
                    id: profile.id,
                },
                username: profile.emails[0].value,
                password: "LoginWithGoogle"
            });
            await newUser.save();
            console.log(newUser, 'newUser')
            return done(null, newUser);
        } catch (error) {
            return done(null, false)
        }
    }
));

export default passport;