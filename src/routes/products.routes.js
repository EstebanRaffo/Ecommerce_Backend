import { Router } from "express";
import { productsService } from "../dao/services/services.js";

const router = Router();

router.get("/", async (req, res) => {
    try{
        const params = req.query;
        const result = await productsService.getProducts(params);
        console.log("products: ", result, "\nproducts.docs.length: ", result.docs.length)
        if(result.docs.length){
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
            res.status(200).json(data_products.payload); 
        }else{
            res.send("No se encontraron productos");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try{
        const product = await productsService.getProductById(id);
        if(product){
            res.status(200).json(product);
        }else{
            res.send("No se encontró el producto buscado o no existe");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.post("/", async (req, res) => {
    try{
        const new_product = await productsService.createProduct(req.body);
        res.status(201).json({message: "Nuevo producto agregado exitosamente", data: new_product});
    }catch(error){
        res.json({status:"error", message: error.message});
    }
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const new_product_info = req.body;
    try{
        const product_updated = await productsService.updateProduct(id, new_product_info);
        res.status(201).json({message: "Producto actualizado exitosamente", data: product_updated});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});


router.delete("/:pid", async (req, res)=>{
    const id = req.params.pid;
    try{
        await productsService.deleteProduct(id);
        res.status(201).json({message: "Producto eliminado exitosamente"});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

export {router as productsRouter};