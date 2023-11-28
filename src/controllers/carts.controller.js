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
                // res.render("cart", { products: cart.products })
                // Para test desde Postman
                res.status(200).json({cart: cart})
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
            await CartsService.deleteProductsOfCart(cart_id);
            const cart_updated = await CartsService.updateProductsInCart(cart_id, products);
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

    // La compra debe corroborar el stock del producto al momento de finalizarse:
    // Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del 
    // producto y continuar.
    // Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto 
    // al proceso de compra. 
    // Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
    // En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
    // Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. 
    // Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.

    static async buyCart(req, res){
        const cart_id = req.params.cid;
        try {
            const cart = await CartsService.getCartById(cart_id);
            const availables_products = cart.products.filter(product => product.quantity <= product._id.stock);
            console.log("buyCart -> availables_products: ", availables_products)
            const unavailables_products = cart.products.filter(product => product.quantity > product._id.stock);
            const unavailables_products_list = unavailables_products.map(product => product._id);
            console.log("buyCart -> unavailables_products_list: ", unavailables_products_list)
            const purchase_amount = availables_products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
            console.log("buyCart -> purchase_amount: ", purchase_amount)
            // await this.updateStocks(availables_products);

            const all_products = await ProductsService.getProducts();
            console.log("updateStocks -> all_products.docs: ", all_products.docs)

            availables_products.forEach(async available_product => {
                console.log("updateStocks -> available_product: ", available_product)
                const product_found = all_products.docs.find(product => product.id === available_product._id._id.valueOf());
                console.log("updateStocks -> product_found: ", product_found)
                
                const new_product_info = {
                    stock: product_found.stock - available_product.quantity
                } 
                console.log("updateStocks -> new_product_info: ", new_product_info) 
                const product = await ProductsService.updateProduct(product_found._id._id, new_product_info);  
                       
            });

            const cart_updated = await CartsService.updateProductsInCart(cart_id, unavailables_products_list);
            console.log("updateStocks -> cart_updated: ", cart_updated)

            const ticket = {
                code: uuidv4(),
                purchase_datetime: Date(),
                amount: purchase_amount,
                purchaser: req.user.email
            }
            const result = await TicketsService.buyCart(ticket);
            res.status(201).json({message: "Compra realizada con éxito", ticket: result, excluidos: unavailables_products_list, carrito: cart_updated});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }

    async updateStocks(availables_products){
        console.log("Entro en updateStocks")
        try {
            console.log("Entro en try updateStocks")
            console.log("availables_products: ", availables_products)
            const all_products = await ProductsService.getProducts();
            console.log("updateStocks -> all_products: ", all_products)
            availables_products.forEach(async available_product => {
                console.log("updateStocks -> available_product: ", available_product)
                const product_found = all_products.find(product => product._id === available_product._id.id);
                const new_product_info = {
                    stock: product_found.stock - available_product.quantity
                }  
                const product = await ProductsService.updateProduct(product_found.id, new_product_info);  
                console.log("updateStocks -> product: ", product)        
            });
        } catch (error) {
            throw error;
        }
    }
}