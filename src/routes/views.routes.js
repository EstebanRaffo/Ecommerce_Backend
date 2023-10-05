import { Router } from "express";
import { chatService, productsService } from "../dao/services/services.js";

const router = Router();

router.get("/", async (req,res)=>{
    const products = await productsService.getProducts();
    res.render("home", {products: products});
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTimeProducts");
});

router.get("/chat", async (req, res)=>{
    // const messages = await chatService.getMessages();
    // res.render("chat", {messages: messages});
    res.render("chat");
});

export {router as viewsRouter};