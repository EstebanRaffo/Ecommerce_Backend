import { Router } from "express";
// import { cartsService } from "../dao/index.js";

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
    try{
        const cid = req.params.cid;
        const cart = await cartsService.getCartById(cid);
        if(req.user?.email){
            res.render("cart", { products: cart.products })
        }else{
            res.redirect("/login");
        }
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

router.delete("/:cid/products/:pid", async (req, res)=>{
    const cart_id = req.params.cid;
    const prod_id = req.params.pid;
    try {
        const cart_updated = await cartsService.deleteProduct(cart_id, prod_id);
        res.status(201).json({message: "El producto fue eliminado del carrito", data: cart_updated});
    } catch (error) {
        res.json({status: "error", message: error.message});
    }
});

router.put("/:cid", async (req, res)=>{
    const cart_id = req.params.cid;
    const { products } = req.body;
    try {
        await cartsService.deleteProductsOfCart(cart_id);
        const cart_updated = await cartsService.updateProductsInCart(cart_id, products);
        res.status(201).json({message: "Los productos del carrito fueron actualizados", data: cart_updated});
    } catch (error) {
        res.json({status: "error", message: error.message});
    }
});

router.put("/:cid/products/:pid", async (req, res)=>{
    const cart_id = req.params.cid;
    const prod_id = req.params.pid;
    const { quantity } = req.body;
    try {
        const cart_updated = await cartsService.updateProductQuantityInCart(cart_id, prod_id, quantity);
        res.status(201).json({message: "Se actualizó la cantidad del producto en el carrito", data: cart_updated});
    } catch (error) {
        res.json({status: "error", message: error.message});
    }
});

router.delete("/:cid", async (req, res)=>{
    const cart_id = req.params.cid;
    try {
        const cart_updated = await cartsService.deleteProductsOfCart(cart_id);
        res.status(201).json({message: "Los productos fueron eliminados del carrito", data: cart_updated});
    } catch (error) {
        res.json({status: "error", message: error.message});
    }
});


export {router as cartsRouter};