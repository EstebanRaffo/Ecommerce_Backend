import { Router } from "express";
import { userService } from "../dao/services/services.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

// router.post("/signup", async(req,res)=>{
//     try {
//         const signupForm = req.body;
//         const result = await userService.createUser(signupForm);
//         res.render("login",{message:`Usuario ${result.first_name} ${result.last_name} registrado correctamente`});
//     } catch (error) {
//         res.render("signup",{error:"No se pudo registrar el usuario"});
//     }
// });

// router.post("/login", async(req,res)=>{
//     try {
//         const loginForm = req.body;
//         if(userService.isAdmin(loginForm)){ 
//             req.session.email = loginForm.email;
//             req.session.rol = config.admin.rol;
//         }else{
//             const user = await userService.getUser(loginForm.email);
//             if(!user){
//                 return res.render("login",{error:"Este usuario no esta registrado"});
//             }
//             if(user.password !== loginForm.password){
//                 return res.render("login",{error:"Credenciales inválidas"});
//             }
//             req.session.first_name = user.first_name;
//             req.session.last_name = user.last_name;
//             req.session.email = user.email;
//             req.session.age = user.age;
//             req.session.rol = user.rol;
//         }
//         res.redirect("/products");
//     } catch (error) {
//         res.render("login",{error:"No se pudo iniciar sesion para este usuario"});
//     }
// });

//Rutas de registro
router.post("/signup", passport.authenticate("signupLocalStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}) , async(req,res)=>{
    res.render("profile",{message:"Usuario registrado correctamente"});
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
    res.redirect("/profile");
});

//Ruta de solicitud login con github
router.get("/login-github", passport.authenticate("loginGithubStrategy"));

//ruta del callback con github
router.get(config.github.callbackUrl, passport.authenticate("loginGithubStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}), (req,res)=>{
    res.redirect("/profile");
});


export {router as sessionsRouter};