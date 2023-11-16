import passport from "passport";
import localStrategy from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { config } from "./config.js";
import GithubStrategy from "passport-github2";
import { UsersService } from "../services/users.service.js";


export const initializePassport = ()=>{
    passport.use("signupLocalStrategy", new localStrategy(
        {
            passReqToCallback:true,
            usernameField:"email"
        },
        async (req, username, password, done)=>{
            const {first_name, last_name, age} = req.body;
            try {
                const user = await UsersService.getUser(username);
                if(user){
                    return done(null,false);
                }
                const new_user = {
                    first_name,
                    last_name,
                    email:username,
                    age,
                    password:createHash(password)
                };
                const user_created = await UsersService.createUser(new_user);
                return done(null, user_created);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("loginLocalStrategy", new localStrategy(
        {
            usernameField:"email",
        },
        async (username, password, done)=>{
            try {
                const user = await UsersService.getUser(username);
                if(!user){
                    return done(null, false);
                }
                if(!isValidPassword(password, user)){
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("signupGithubStrategy", new GithubStrategy(
        {
            clientID:config.github.clientId,
            clientSecret:config.github.clientSecret,
            callbackURL:`http://localhost:8080/api/sessions${config.github.callbackUrl}`
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                const user = await UsersService.getUser(profile._json.email);
                if(user){
                    return done(null, user);
                }
                const new_user = {
                    first_name:profile._json.name.split(' ')[0],
                    last_name:profile._json.name.split(' ')[1],
                    email:profile._json.email,
                    password:profile._json.id,
                    age:''
                };
                const user_created = await UsersService.createUser(new_user);
                return done(null, user_created);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("loginGithubStrategy", new GithubStrategy({
        clientID:config.github.clientId,
        clientSecret:config.github.clientSecret,
        callbackURL:`http://localhost:8080/api/sessions${config.github.callbackUrl}`
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
            const user = await UsersService.getUser(profile._json.email);
            if(!user){
                return done(null, false);
            }
            if(!isValidPassword(profile.id, user)){
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done)=>{
        try {
            const user = await UsersService.getUserById(id);
            done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}
