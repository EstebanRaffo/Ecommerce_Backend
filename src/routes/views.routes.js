import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    res.render("home");
});

router.get("/realtimeproducts", (req,res)=>{
    const product_list = []
    res.render("realTimeProducts", product_list);
});

export {router as viewsRouter};