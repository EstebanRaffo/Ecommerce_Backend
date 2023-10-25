import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

//Rutas de registro
router.post("/signup", passport.authenticate("signupLocalStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}) , async(req,res)=>{
    const {first_name, last_name, email, age, rol} = req.user
    const isAdmin = rol === config.admin.rol; 
    res.render("profile",{message:"Usuario registrado correctamente", first_name, last_name, email, age, rol, isAdmin});
});

router.get("/fail-signup",(req,res)=>{
    res.render("signup",{error:"No se pudo registrar el usuario"});
});

//Rutas de login
router.post("/login", passport.authenticate("loginLocalStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}) , async(req,res)=>{
    res.redirect("/products");
});

router.get("/fail-login",(req,res)=>{
    res.render("login",{error:"No se pudo iniciar sesion para este usuario"});
});

router.get("/logout", async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err) return res.render("profile",{error:"No se pudo cerrar la sesion"});
            res.redirect("/login");
        })
    } catch (error) {
        res.render("profile",{error:"No se pudo cerrar la sesión"});
    }
});


//Ruta de solicitud registro con github
router.get("/signup-github", passport.authenticate("signupGithubStrategy"));

//ruta del callback con github
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}), (req,res)=>{
    res.redirect("/products");
});

//Ruta de solicitud login con github
router.get("/login-github", passport.authenticate("loginGithubStrategy"));

//ruta del callback con github
router.get(config.github.callbackUrl, passport.authenticate("loginGithubStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}), (req,res)=>{
    res.redirect("/products");
});


export {router as sessionsRouter};