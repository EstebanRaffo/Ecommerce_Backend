import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";
import { SessionsController } from "../controllers/sessions.controller.js";

const router = Router();

router.post("/signup", passport.authenticate("signupLocalStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}), SessionsController.renderProfile);

router.get("/fail-signup", SessionsController.renderFailSignup);

router.post("/login", passport.authenticate("loginLocalStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}), SessionsController.redirectToProducts);

router.get("/fail-login", SessionsController.renderFailLogin);

router.get("/logout", SessionsController.logout);

//Ruta de solicitud registro con github
router.get("/signup-github", passport.authenticate("signupGithubStrategy"));

//ruta del callback con github
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}), SessionsController.redirectToProducts);

//Ruta de solicitud login con github
router.get("/login-github", passport.authenticate("loginGithubStrategy"));

//ruta del callback con github
router.get(config.github.callbackUrl, passport.authenticate("loginGithubStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}), SessionsController.redirectToProducts);

router.get("/current", SessionsController.currentUser);
router.post("/send-mail", SessionsController.sendResetPasswordMail);
router.post("/reset-password", SessionsController.resetPassword);
router.get("/profile", SessionsController.renderProfile);


export {router as sessionsRouter};