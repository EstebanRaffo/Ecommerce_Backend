import { Router } from "express";
import { productsService } from "../dao/services/services.js";

const router = Router();

router.get("/", async (req,res)=>{
    const products = await productsService.getProducts();
    res.render("home", {products: products});
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTimeProducts");
});

export {router as viewsRouter};