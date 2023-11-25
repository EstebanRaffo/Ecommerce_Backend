import { cartsModel } from "../models/carts.model.js";
import { productsDao } from "../../index.js";

export class CartsManagerMongo{
    constructor(){
        this.model = cartsModel;
    }

    async getCarts(){
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            console.log("getCarts: ", error.message);
            throw new Error("No se pudo obtener el listado de carritos");
        }
    }

    async createCart(products){
        try {
            const result = await this.model.create(products);
            return result;
        } catch (error) {
            console.log("createCart: ", error.message);
            throw new Error("No se pudo crear el carrito");
        }
    }

    async getProductsCart(cart_id){
        try {
            const cart = await this.model.findById(cart_id);
            return cart.products;
        } catch (error) {
            console.log("getProductsCart: ", error.message);
            throw new Error("No se pudieron obtener los productos del carrito");
        }
    }
    
    async getCartById(cid){
        try {
            const cart = await this.model.findById(cid).populate("products._id").lean();
            if(!cart){
                throw new Error(`El carrito con el ID: ${cid} no existe.`);
            }
            return cart;
        } catch (error) {
            console.log("getCartById: ", error.message);
            throw new Error("No se pudo obtener el carrito");
        }
    }

    isInCart(products_in_cart, prod_id){
        if(!products_in_cart.length){
            return false;
        }else{
            return products_in_cart.some(product => product._id.valueOf() === prod_id );
        } 
    }

    async addProductToCart(cart_id, prod_id){
        try {
            if(await productsDao.productExists(prod_id)){
                const products_in_cart = await this.getProductsCart(cart_id);
                if(this.isInCart(products_in_cart, prod_id)){      
                    const new_products_list = products_in_cart.map(product=>{
                        if(product._id.valueOf() === prod_id){
                            product.quantity++;
                        }
                        return product;
                    });
                    const cart_updated = await this.updateProductsInCart(cart_id, new_products_list);
                    return cart_updated;
                }else{
                    products_in_cart.push({_id: prod_id, quantity: 1});
                    const cart_updated = await this.updateProductsInCart(cart_id, products_in_cart);
                    return cart_updated;
                }   
            }else{
                throw new Error("No se pudo agregar el producto al carrito o no existe.")
            }
        } catch (error) {
            console.log("addProductToCart: ", error.message);
            throw error;
        }
    }

    async updateProductsInCart(cart_id, new_products_list){
        try {
            const filter = { _id: cart_id };
            const update = { products: new_products_list };
            const cart_updated = await this.model.findOneAndUpdate(filter, update, { new:true });
            if(!cart_updated){
                throw new Error("No se encontró el carrito a actualizar");
            }
            return cart_updated;
        } catch (error) {
            console.log("updateProductsInCart: ", error.message);
            throw new Error("No se pudo actualizar el carrito con la nueva lista de productos");
        }
    }

    async deleteProduct(cart_id, prod_id){
        try {
            if(await productsDao.productExists(prod_id)){
                const products_in_cart = await this.getProductsCart(cart_id);
                if(this.isInCart(products_in_cart, prod_id)){
                    const new_product_list = products_in_cart.filter(product => product._id.valueOf() !== prod_id);
                    const cart_updated = await this.updateProductsInCart(cart_id, new_product_list);
                    return cart_updated;
                }else{
                    throw new Error("El producto que desea eliminar no se encuentra en el carrito");
                }
            }else{
                throw new Error("No existe el producto que desea eliminar del carrito.");
            }
        } catch (error) {
            console.log("deleteProduct: ", error.message);
            throw new Error("No se pudo eliminar el producto del carrito");
        }
    }

    async updateProductQuantityInCart(cart_id, prod_id, new_quantity){
        try {
            if(await productsDao.productExists(prod_id)){
                const products_in_cart = await this.getProductsCart(cart_id);
                if(this.isInCart(products_in_cart, prod_id)){
                    const new_products_list = products_in_cart.map(product=>{
                        if(product._id.valueOf() === prod_id){
                            product.quantity = new_quantity;
                        }
                        return product;
                    });
                    const cart_updated = await this.updateProductsInCart(cart_id, new_products_list);
                    return cart_updated;
                }else{
                    throw new Error("El producto que desea actualizar no se encuentra en el carrito");
                }
            }else{
                throw new Error("No existe el producto que desea actualizar en el carrito.");
            }
        } catch (error) {
            console.log("updateProductQuantityInCart: ", error.message);
            throw new Error("No se pudo actualizar la cantidad del producto en el carrito");
        }
    }

    async deleteProductsOfCart(cart_id){
        try {
            const new_products_list = [];
            const cart_updated = await this.updateProductsInCart(cart_id, new_products_list);
            return cart_updated;
        } catch (error) {
            console.log("deleteProductsOfCart: ", error.message);
            throw new Error("No se pudieron eliminar los productos del carrito");
        }
    }
}
