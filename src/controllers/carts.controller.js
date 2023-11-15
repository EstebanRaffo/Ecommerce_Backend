import { CartsService } from "../services/carts.service.js";

export class CartsController{
    
    static async getCarts(req, res){
        try {
            const result = await CartsService.getCarts();
            res.status(200).json(result);
        } catch (error) {
            res.json({status: "error", message:error.message});
        }
    }

    static async createCart(req, res){
        const { products } = req.body;
        try{
            const new_cart = await CartsService.createCart(products);
            res.status(201).json({message: "Nuevo carrito agregado", data: new_cart});
        }catch(error){
            res.json({status: "error", message: error.message});
        }
    }

    static async getCartById(req, res){
        try{
            const cid = req.params.cid;
            const cart = await CartsService.getCartById(cid);
            if(req.user?.email){
                res.render("cart", { products: cart.products })
            }else{
                res.redirect("/login");
            }
        }catch(error){
            res.json({status: "error", message: error.message});
        }
    }

    static async addProductToCart(req, res){
        const cart_id = req.params.cid;
        const prod_id = req.params.pid;
        try{
            const cart_updated = await CartsService.addProductToCart(cart_id, prod_id);
            res.status(201).json({message: "Producto agregado en el carrito", data: cart_updated});
        }catch(error){
            res.json({status: "error", message: error.message});
        }
    }

    static async deleteProduct(req, res){
        const cart_id = req.params.cid;
        const prod_id = req.params.pid;
        try {
            const cart_updated = await CartsService.deleteProduct(cart_id, prod_id);
            res.status(201).json({message: "El producto fue eliminado del carrito", data: cart_updated});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }

    static async updateCart(req, res){
        const cart_id = req.params.cid;
        const { products } = req.body;
        try {
            await cartsService.deleteProductsOfCart(cart_id);
            const cart_updated = await cartsService.updateProductsInCart(cart_id, products);
            res.status(201).json({message: "Los productos del carrito fueron actualizados", data: cart_updated});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }

    static async updateProductsInCart(cart_id, products){
        try {
            const cart_updated = CartsService.updateProductsInCart(cart_id, products);
            res.status(201).json({message: "Los productos del carrito fueron actualizados", data: cart_updated});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }

    static async updateProductQuantityInCart(req, res){
        const cart_id = req.params.cid;
        const prod_id = req.params.pid;
        const { quantity } = req.body;
        try {
            const cart_updated = await CartsService.updateProductQuantityInCart(cart_id, prod_id, quantity);
            res.status(201).json({message: "Se actualizó la cantidad del producto en el carrito", data: cart_updated});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }

    static async deleteProductsOfCart(req, res){
        const cart_id = req.params.cid;
        try {
            const cart_updated = await CartsService.deleteProductsOfCart(cart_id);
            res.status(201).json({message: "Los productos fueron eliminados del carrito", data: cart_updated});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }
}