import { Router } from "express";
import { cartsService } from "../dao/services/services.js";

const router = Router();

router.post("/", async (req, res)=>{
    const { products } = req.body;
    try{
        const new_cart = await cartsService.createCart(products);
        res.status(201).json({message: "Nuevo carrito agregado", data: new_cart});
    }catch(error){
        res.json({status: "error", message: error.message});
    }
});

router.get("/:cid", async (req, res)=>{
    const id = req.params.cid;
    try{
        const products_cart = await cartsService.getProductsCart(id);
        res.status(201).json({message: "Productos del carrito", data: products_cart});
    }catch(error){
        res.json({status: "error", message: error.message});
    }
});

router.post("/:cid/product/:pid", async (req, res)=>{
    const cart_id = req.params.cid;
    const prod_id = req.params.pid;
    try{
        const cart_updated = await cartsService.addProductToCart(cart_id, prod_id);
        res.status(201).json({message: "Producto agregado en el carrito", data: cart_updated});
    }catch(error){
        res.json({status: "error", message: error.message});
    }
});

export {router as cartsRouter};