import { cartsDao } from "../dao/index.js";

export class CartsService{

    static async getCarts(){
        try {
            const result = await cartsDao.getCarts();
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createCart(products){
        try {
            const result = await cartsDao.createCart(products);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getCartById(cid){
        try {
            const result = await cartsDao.getCartById(cid);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async addProductToCart(cart_id, prod_id){
        try {
            const result = await cartsDao.addProductToCart(cart_id, prod_id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateProductsInCart(cart_id, new_products_list){
        try {
            const result = await cartsDao.updateProductsInCart(cart_id, new_products_list);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(cart_id, prod_id){
        try {
            const result = await cartsDao.deleteProduct(cart_id, prod_id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateProductQuantityInCart(cart_id, prod_id, new_quantity){
        try {
            const result = cartsDao.updateProductQuantityInCart(cart_id, prod_id, new_quantity);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteProductsOfCart(cart_id){
        try {
            const result = cartsDao.deleteProductsOfCart(cart_id);
            return result;           
        } catch (error) {
            throw error;
        }
    }
}