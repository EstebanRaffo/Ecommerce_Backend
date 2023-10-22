import { Router } from "express";
import { productsService } from "../dao/services/services.js";
import { config } from "../config/config.js";

const router = Router();

router.get("/", (req,res)=>{
    if(req.session.email){
        res.render("home");
    }else{
        res.redirect("/login");
    }
});

router.get("/realtimeproducts", (req,res)=>{
    if(req.session.email){
        res.render("realTimeProducts");
    }else{
        res.redirect("/login");
    }
});

router.get("/chat", async (req, res)=>{
    if(req.session.email){
        res.render("chat");
    }else{
        res.redirect("/login");
    }
});

router.get("/products", async (req, res)=>{
    try{
        if(req.session.email){
            const params = req.query;
            const result = await productsService.getProducts(params);
            const {first_name, last_name, email, age, rol} = req.session; 
            const isAdmin = rol === config.admin.rol; 
            if(result.docs.length){
                const data_products = productsService.getPaginateData(result, req);
                res.render("products", {first_name, last_name, email, age, rol, isAdmin, products: data_products.payload, prevLink: data_products.prevLink, nextLink: data_products.nextLink, hasPrevPage: data_products.hasPrevPage, hasNextPage: data_products.hasNextPage});
            }else{
                res.send("No se encontraron productos");
            }
        }else{
            res.redirect("/login");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.get("/signup",(req,res)=>{
    if(req.session.email){
        res.redirect("/profile");
    }else{
        res.render("signup");
    }
});

router.get("/login",(req,res)=>{
    if(req.session.email){
        res.redirect("/profile");
    }else{
        res.render("login");
    }
});

router.get("/profile",(req,res)=>{
    if(req.user?.email){
        const {first_name, last_name, email, age, rol} = req.user;
        const isAdmin = rol === config.admin.rol; 
        res.render("profile",{first_name, last_name, email, age, rol, isAdmin});
    } else {
        res.redirect("/login");
    }
});

export {router as viewsRouter};