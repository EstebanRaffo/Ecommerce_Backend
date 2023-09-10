import { Router } from "express";
import { productsService } from "../persistence/services";

const router = Router();

router.get("/", async (req, res) => {
    try{
        const products = await productsService.getProducts();
        const limit = req.query.limit;
        if(products.length){
            if(limit){
                const product_list = products.slice(0, limit);
                res.send(product_list);
            }else{
                res.send(products);
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
            res.send(product);
        }else{
            res.send("<h1 style='color: red'>No se encontró el producto buscado o no existe</h1>");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.post("/", async (req, res) => {
    const {title, description, price, thumbnail, code, stock, category} = req.body;
    try{
        await productsService.addProduct(title, description, price, thumbnail, code, stock, category);
        res.status(200).json({message: "nuevo producto agregado"});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const new_product_info = req.body;
    try{
        await productsService.updateProduct(id, new_product_info);
        res.status(200).json({message: "producto actualizado"});
    }catch(error){
        res.json({status:"error", message:error.message});
        // res.status(404).json({message:"El usuario no existe"});
    }
});


router.delete("/:pid", async (req, res)=>{
    const id = parseInt(req.params.pid);
    try{
        await productsService.deleteProduct(id);
        res.status(200).json({message: "producto eliminado"});
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

export {router as productsRouter};