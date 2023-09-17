import { Router } from "express";
import { productsService } from "../services/services.js";

const router = Router();

router.get("/", async (req,res)=>{
    const products = await productsService.getProducts();
    res.render("home", {products: products});
});

router.get("/realtimeproducts", (req,res)=>{
    const product_list = []
    res.render("realTimeProducts", product_list);
});

export {router as viewsRouter};