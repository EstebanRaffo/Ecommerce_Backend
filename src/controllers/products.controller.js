import { ProductsService } from "../services/products.service.js"
import { generateProduct } from "../helpers/mocks.js";

export class ProductsController{

    static async getProducts(req, res){
        try{
            const query_params = req.query;
            const result = await ProductsService.getProducts(query_params);
            
            if(result.docs.length){
                const data_products = ProductsService.getPaginateData(result, req);
                res.status(200).json(data_products.payload); 
            }else{
                res.send("No se encontraron productos");
            }
        }catch(error){
            res.json({status:"error", message:error.message});
        }
    }

    static async getProductById(req, res){
        const id = req.params.pid;
        try{
            const product = await ProductsService.getProductById(id);
            if(product){
                res.status(200).json(product);
            }else{
                res.send("No se encontró el producto buscado o no existe");
            }
        }catch(error){
            res.json({status:"error", message:error.message});
        }
    }

    static async createProduct(req, res){
        try{
            const new_product = await ProductsService.createProduct(req.body);
            res.status(201).json({message: "Nuevo producto agregado exitosamente", data: new_product});
        }catch(error){
            res.json({status:"error", message: error.message});
        }
    }

    static async updateProduct(req, res){
        const id = req.params.pid;
        const new_product_info = req.body;
        try{
            const product_updated = await ProductsService.updateProduct(id, new_product_info);
            res.status(201).json({message: "Producto actualizado exitosamente", data: product_updated});
        }catch(error){
            res.json({status:"error", message:error.message});
        }
    }

    static async deleteProduct(req, res){
        const id = req.params.pid;
        try{
            await ProductsService.deleteProduct(id);
            res.status(201).json({message: "Producto eliminado exitosamente"});
        }catch(error){
            res.json({status:"error", message:error.message});
        }
    }

    static generateProducts(req, res){
        let products = [];
        for(let i = 0; i < 100; i++){
            const new_product = generateProduct();
            products.push(new_product);
        }
        res.json({status:"success", data: products});
    }
}