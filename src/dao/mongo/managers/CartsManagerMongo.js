import {cartsModel} from "../models/carts.model.js";
import { productsService } from "../../services/services.js";

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

    async getProductsCart(id){
        try {
            const cart = await this.model.findById(id)
            return cart.products;
        } catch (error) {
            console.log("getProductsCart: ", error.message);
            throw new Error("No se pudieron obtener los productos del carrito");
        }
    }

    async getCartById(id){
        try {
            const cart = await this.model.findById(id)
            return cart;
        } catch (error) {
            console.log("getCartById: ", error.message);
            throw new Error("No se pudo obtener el carrito");
        }
    }

    isInCart(products_cart, prod_id){
        if(!products_cart){
            return false;
        }else{
            return products_cart.some(product => product.pid === prod_id)
        } 
    }

    async addProductToCart(cart_id, prod_id){
        try {
            const carts = await this.getCarts()
            const cart = await this.getCartById(cart_id)
            if(await productsService.productExists(prod_id)){
                if(this.isInCart(cart.products, prod_id)){
                    carts.forEach(async cart => {
                        if(cart.cid === cart_id){
                            const new_products_list = cart.products.map(product => {
                                if(product.pid === prod_id){
                                    product.quantity++;
                                    return product;
                                }else{
                                    return product;
                                }
                            });
                            await this.model.findByIdAndUpdate(cart_id, new_products_list, {new:true});
                            return cart;
                        }else{
                            return cart;
                        }
                    });
                }else{
                    const new_carts_list = carts.map(cart => {
                        if(cart.cid === cart_id){
                            cart.products.push({pid: prod_id, quantity: 1})
                            
                            return cart;
                        }else{
                            return cart;
                        }
                    });
                    await this.model.findByIdAndUpdate
                }   
            }else{
                throw new Error("No es posible agregar el producto al carrito o no existe.")
            }
        } catch (error) {
            console.log("addProductToCart: ", error.message);
            throw error;
        }
    }
}
