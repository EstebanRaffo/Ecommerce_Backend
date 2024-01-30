import { productsDao } from "../dao/index.js";


export class ProductsService{
  
    static async getProducts(query_params){
        try {
            const result = await productsDao.getProducts(query_params);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static getPaginateData(result, req){
        return productsDao.getPaginateData(result, req);
    }

    static async getProductById(pid){
        try {
            const result = await productsDao.getProductById(pid);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createProduct(body){
        try {
            const result = await productsDao.createProduct(body);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(id, new_product_info){
        try {
            const result = await productsDao.updateProduct(id, new_product_info);
            return result;       
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(pid, user){
        try {
            const result = await productsDao.deleteProduct(pid, user);
            return result;
        } catch (error) {
            throw error;
        }
    }
};