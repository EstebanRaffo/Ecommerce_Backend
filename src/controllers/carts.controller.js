import { CartsService } from "../services/carts.service.js";
import { TicketsService } from "../services/tickets.service.js";
import { ProductsService } from "../services/products.service.js"
import { v4 as uuidv4 } from 'uuid';

export class CartsController{
    
    static async getCarts(req, res){
        try {
            const result = await CartsService.getCarts();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({status: "error", message:error.message});
        }
    }

    static async createCart(req, res){
        const { products } = req.body;
        try{
            const new_cart = await CartsService.createCart(products);
            res.status(201).json({message: "Carrito creado exitosamente", data: new_cart});
        }catch(error){
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async getCartById(req, res){
        try{
            const cid = req.params.cid;
            const cart = await CartsService.getCartById(cid);
            if(req.user?.email){
                res.status(200).json({cart: cart})
            }else{
                res.redirect("/login");
            }
        }catch(error){
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async addProductToCart(req, res){
        const cart_id = req.params.cid;
        const prod_id = req.params.pid;
        const user = req.user;
        try{
            const cart_updated = await CartsService.addProductToCart(cart_id, prod_id, user);
            res.status(201).json({message: "Producto agregado al carrito", data: cart_updated});
        }catch(error){
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async deleteProduct(req, res){
        const cart_id = req.params.cid;
        const prod_id = req.params.pid;
        try {
            const cart_updated = await CartsService.deleteProduct(cart_id, prod_id);
            res.status(201).json({message: "Producto eliminado del carrito", data: cart_updated});
        } catch (error) {
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async updateCart(req, res){
        const cart_id = req.params.cid;
        const { products } = req.body;
        try {
            await CartsService.deleteProductsOfCart(cart_id);
            const cart_updated = await CartsService.updateProductsInCart(cart_id, products);
            res.status(201).json({message: "Productos del carrito actualizados", data: cart_updated});
        } catch (error) {
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async updateProductQuantityInCart(req, res){
        const cart_id = req.params.cid;
        const prod_id = req.params.pid;
        const { quantity } = req.body;
        try {
            const cart_updated = await CartsService.updateProductQuantityInCart(cart_id, prod_id, quantity);
            res.status(201).json({message: "Cantidad del producto en el carrito actualizada", data: cart_updated});
        } catch (error) {
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async deleteProductsOfCart(req, res){
        const cart_id = req.params.cid;
        try {
            const cart_updated = await CartsService.deleteProductsOfCart(cart_id);
            res.status(201).json({message: "Productos eliminados del carrito", data: cart_updated});
        } catch (error) {
            res.status(400).json({status: "error", message: error.message});
        }
    }

    static async buyCart(req, res){
        const cart_id = req.params.cid;
        try {
            const cart = await CartsService.getCartById(cart_id);
            const valid_items = cart.products.filter(item => item._id);
            const availables_products = valid_items.filter(item => item.quantity <= item._id.stock);
            if(!availables_products.length) throw Error("No se encontraron productos disponibles por stock insuficiente");
            const unavailables_products = valid_items.filter(product => product.quantity > product._id.stock);
            const purchase_amount = availables_products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
            const all_products = await ProductsService.getAllProducts();
            
            const new_products_stocks = availables_products.map(available_product => {
                const product_found = all_products.find(product => product.code === available_product._id.code);
                return {
                    stock: product_found.stock - available_product.quantity,
                    title: product_found.title,
                    description: product_found.description,
                    price: product_found.price,
                    thumbnails: product_found.thumbnails,
                    code: product_found.code,
                    category: product_found.category,
                    status: product_found.status,
                    owner: product_found.owner
                }
            });
            
            const new_products_stocks_ids = availables_products.map(product => product._id._id.valueOf());
            await ProductsService.deleteProducts(new_products_stocks_ids);
            const products_stocks_updated = await ProductsService.createProducts(new_products_stocks);
            
            await CartsService.deleteProductsOfCart(cart_id);
            const cart_updated = await CartsService.updateProductsInCart(cart_id, unavailables_products);
            const ticket = {
                code: uuidv4(),
                purchase_datetime: Date(),
                amount: purchase_amount,
                purchaser: req.user.email
            }
            const result = await TicketsService.buyCart(ticket);
            res.status(201).json({message: "Compra exitosa", ticket: result, excluidos: unavailables_products, carrito: cart_updated});
        } catch (error) {
            res.status(400).json({status: "error", message: error.message});
        }
    }
}