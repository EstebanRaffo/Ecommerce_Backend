import { Router } from "express";
import { usersModel } from "../dao/mongo/models/users.model.js";

const router = Router();

router.post("/signup", async(req,res)=>{
    try {
        const signupForm = req.body;
        const result = await usersModel.create(signupForm);
        res.render("login",{message:"Usuario registrado correctamente"});
    } catch (error) {
        res.render("signup",{error:"No se pudo registrar el usuario"});
    }
});

router.post("/login", async(req,res)=>{
    try {
        const loginForm = req.body;
        const user = await usersModel.findOne({email:loginForm.email});
        if(!user){
            return res.render("login",{error:"Este usuario no esta registrado"});
        }
        if(user.password !== loginForm.password){
            return res.render("login",{error:"Credenciales inválidas"});
        }
        req.session.first_name = user.first_name;
        req.session.last_name = user.last_name;
        req.session.email = user.email;
        req.session.age = user.age;
        res.redirect("/products");
    } catch (error) {
        res.render("login",{error:"No se pudo iniciar sesion para este usuario"});
    }
});

router.get("/logout", async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err) return res.render("profile",{error:"No se pudo cerrar la sesion"});
            res.redirect("/login");
        })
    } catch (error) {
        res.render("signup",{error:"No se pudo registrar el usuario"});
    }
});

export {router as sessionsRouter};