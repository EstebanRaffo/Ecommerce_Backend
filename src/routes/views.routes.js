import { Router } from "express";
import { productsService } from "../dao/services/services.js";

const router = Router();

router.get("/", async (req,res)=>{
    res.render("home");
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTimeProducts");
});

router.get("/chat", async (req, res)=>{
    res.render("chat");
});

router.get("/products", async (req, res)=>{
    try{
        const params = req.query;
        const result = await productsService.getProducts(params);
        
        if(result.docs.length){
            const data_products = productsService.getPaginateData(result, req);
            res.render("products", {products: data_products.payload, prevLink: data_products.prevLink, nextLink: data_products.nextLink, hasPrevPage: data_products.hasPrevPage, hasNextPage: data_products.hasNextPage});
        }else{
            res.send("No se encontraron productos");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

export {router as viewsRouter};