import { productsModel } from "../models/products.model.js";

export class ProductsManagerMongo{
    constructor(){
        this.model = productsModel;
    }

    async getProducts(query_params){
        if(!query_params){
            const options = {limit: 10, page: 1, lean:true}
            try {
                // const products = this.model.find().lean();
                const products = await this.model.paginate({}, options);
                return products;
            } catch (error) {
                console.log("getProducts: ", error.message);
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
            console.log("getProducts: ", error.message);
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
            console.log("createProduct: ", error.message);
            throw new Error("No se pudo crear el producto");
        }
    }

    async getProductById(productId){
        try {
            const product = await this.model.findById(productId);
            return product;
        } catch (error) {
            console.log("getProductById: ", error.message);
            throw new Error("No se pudo encontrar el producto");
        }
    }

    async updateProduct(productId, newProductInfo){
        try {
            const product_updated = await this.model.findByIdAndUpdate(productId, newProductInfo, {new:true});
            if(!product_updated){
                throw new Error("No se pudo encontrar el producto a actualizar");
            }
            return product_updated;
        } catch (error) {
            console.log("updateProduct: ", error.message);
            throw new Error("No se pudo actualizar el producto");
        }
    }

    async deleteProduct(productId){
        try {
            const product_deleted = await this.model.findByIdAndDelete(productId);
            if(!product_deleted){
                throw new Error("No se pudo encontrar el producto a eliminar");
            }
            return product_deleted;
        } catch (error) {
            console.log("deleteProduct: ", error.message);
            throw new Error("No se pudo eliminar el producto");
        }
    }

    async productExists(id){
        try{
            const products = await this.getProducts();
            return products.some(product => product._id.valueOf() === id);
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }
}