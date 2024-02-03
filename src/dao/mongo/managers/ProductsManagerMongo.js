import { productsModel } from "../models/products.model.js";
import { logger } from "../../../helpers/logger.js";
import { config } from "../../../config/config.js";


export class ProductsManagerMongo{
    constructor(){
        this.model = productsModel;
    }

    async getProducts(query_params){
        if(!query_params){
            const options = {limit: 10, page: 1, lean:true}
            try {
                const products = await this.model.paginate({}, options);
                return products;
            } catch (error) {
                logger.error(`getProducts: ${error.message}`);
                throw new Error("No se pudo obtener el listado de productos sin params");
            }
        }
        const { limit=10, page=1, sort, category, stock } = query_params;
        let options = { limit: +limit, page: +page, lean:true };
        if(sort){
            const value = sort === "asc" ? 1 : -1;
            options.sort = {price: value};
        }   
        let query = {}
        if(category){
            query.category = category;
        }
        if(stock){
            query.stock = +stock;
        }
        try{
            const products_data = await this.model.paginate(query, options);
            return products_data;
        }catch(error){
            logger.error(`getProducts: ${error.message}`);
            throw new Error("No se pudo obtener el listado de productos con params");
        }
    }

    getPaginateData(result, req){
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        const data_products = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` : null,
            nextLink: result.hasNextPage ? baseUrl.includes("page") ?
            baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`) : null
        }
        return data_products;
    }

    async createProduct(productInfo){
        try{
            const result = await this.model.create(productInfo);
            return result;
        }catch(error){
            logger.error(`createProduct: ${error.message}`);
            throw new Error("No se pudo crear el producto");
        }
    }

    async getProductById(pid){
        try {
            const product = await this.model.findById(pid);
            return product;
        } catch (error) {
            logger.error(`getProductById: ${error.message}`);
            throw new Error("No se pudo encontrar el producto");
        }
    }

    async updateProduct(productId, newProductInfo){
        try {
            const product_updated = await this.model.findByIdAndUpdate(productId, newProductInfo, {new:true});
            if(!product_updated) throw new Error("No se pudo encontrar el producto a actualizar");
            return product_updated;
        } catch (error) {
            logger.error(`updateProduct: ${error.message}`);
            throw new Error("No se pudo actualizar el producto");
        }
    }

    async productBelongToUser(prod_id, user){
        try {
            const product = await this.getProductById(prod_id);
            return product.owner === user.email;
        } catch (error) {
            logger.error(`productBelongToUser: ${error.message}`);
            throw error;
        }
    }

    isAdmin(user){
        return user.rol === config.admin.rol;
    }

    async deleteProduct(prod_id, user){
        try {
            if(this.isAdmin(user) || await this.productBelongToUser(prod_id, user)){
                const product_deleted = await this.model.findByIdAndDelete(prod_id);
                if(!product_deleted){
                    throw new Error("No se pudo encontrar el producto a eliminar");
                }
                return product_deleted;
            }else{
                throw new Error("El producto no pertenece al usuario");
            }
        } catch (error) {
            logger.error(`deleteProduct: ${error.message}`);
            throw new Error("No se pudo eliminar el producto");
        }
    }

    async productExists(id){
        try{
            const products = await this.model.find();
            return products.some(product => product._id.valueOf() === id);
        }catch(error){
            logger.error(`productExists: ${error.message}`);
            throw error;
        }
    }
}