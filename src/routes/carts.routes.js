import { Router } from "express";
import { cartsService } from "../services/services";



const router = Router();

router.post("/", async (req, res)=>{
    const {products} = req.body;
    try{
        const new_cart = await cartsService.createCart(products);
        res.status(200).json({message: "nuevo carrito agregado", data: new_cart});
    }catch(error){
        res.json({status: "error", message: error.message});
    }
});

router.get("/:cid", async (req, res)=>{
    const id = req.params.cid;
    try{
        const products_cart = await cartsService.getProductsCart(id);
        res.status(200).json({message: "productos del carrito", data: products_cart});
    }catch(error){
        res.json({status: "error", message: error.message});
    }
});

router.post("/:cid/product/:pid", async (req, res)=>{
    const cart_id = parseInt(req.params.cid);
    const prod_id = parseInt(req.params.pid);
    try{
        await cartsService.addProductToCart(cart_id, prod_id);
        res.status(200).json({message: "producto agregado en el carrito"});
    }catch(error){
        res.json({status: "error", message: error.message});
    }
})