import { Router } from "express";
import { productsService } from "../services/services.js";

const router = Router();

router.get("/", async (req, res) => {
    try{
        const products = await productsService.getProducts();
        const limit = req.query.limit;
        if(products.length){
            if(limit){
                const product_list = products.slice(0, limit);
                res.status(200).json(product_list);
            }else{
                res.status(200).json(products);
            }
        }else{
            res.send("No se encontraron productos");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    try{
        const product = await productsService.getProductById(id);
        if(product){
            res.status(200).json(product);
        }else{
            res.send("<h1 style='color: red'>No se encontró el producto buscado o no existe</h1>");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.post("/", async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body;
    try{
        await productsService.addProduct(title, description, price, thumbnails, code, stock, category, status);
        res.status(201).json({message: "Nuevo producto agregado exitosamente"});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const new_product_info = req.body;
    try{
        await productsService.updateProduct(id, new_product_info);
        res.status(201).json({message: "Producto actualizado exitosamente"});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});


router.delete("/:pid", async (req, res)=>{
    const id = parseInt(req.params.pid);
    try{
        await productsService.deleteProduct(id);
        res.status(201).json({message: "Producto eliminado exitosamente"});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

export {router as productsRouter};