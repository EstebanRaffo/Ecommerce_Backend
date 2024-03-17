import { productsDao } from "../dao/index.js";


export class ProductsService{
  
    static async getPaginatedProducts(query_params){
        try {
            const result = await productsDao.getPaginatedProducts(query_params);
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

    static async deleteProducts(prod_ids){
        try {
            const result = await productsDao.deleteProducts(prod_ids);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createProducts(new_products_stocks){
        try {
            const result = await productsDao.createProducts(new_products_stocks);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getAllProducts(){
        try {
            const result = await productsDao.getAllProducts();
            return result;
        } catch (error) {
            throw error;
        }
    }
};