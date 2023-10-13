import { Router } from "express";
import { productsService } from "../dao/services/services.js";

const router = Router();

router.get("/", async (req,res)=>{
    const products = await productsService.getProducts();
    res.render("home", {products: products});
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTimeProducts");
});

router.get("/chat", async (req, res)=>{
    res.render("chat");
});

router.get("/products", async (req, res)=>{
    try{
        const params = req.query;
        const result = await productsService.getProducts(params);
        
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
            res.render("products", {products: data_products.payload, prevLink: data_products.prevLink, nextLink: data_products.nextLink});
        }else{
            res.send("No se encontraron productos");
        }
    }catch(error){
        res.json({status:"error", message:error.message});
    }
});

export {router as viewsRouter};