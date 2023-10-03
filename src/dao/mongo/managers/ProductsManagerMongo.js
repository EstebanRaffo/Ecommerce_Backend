import { productsModel } from "../models/products.model.js";

export class ProductsManagerMongo{
    constructor(){
        this.model = productsModel;
    }

    async getProducts(){
        try{
            const products = await this.model.find();
            return products;
        }catch(error){
            console.log("getProducts: ", error.message);
            throw new Error("No se pudo obtener el listado de productos");
        }
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
}