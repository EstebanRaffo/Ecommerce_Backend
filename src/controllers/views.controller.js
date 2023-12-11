import { config } from "../config/config.js";
import { ProductsService } from "../services/products.service.js";
import UserDto from "../dao/dto/user.dto.js";
import { logger } from "../helpers/logger.js";

export class ViewsController{

    static renderHome(req,res){
        if(req.user?.email){
            res.render("home");
        }else{
            res.redirect("/login");
        }
    }

    static renderRealTimeProducts(req,res){
        if(req.user?.email){
            res.render("realTimeProducts");
        }else{
            res.redirect("/login");
        }
    }

    static async renderChat(req, res){
        if(req.user?.email){
            // res.render("chat");

            // Para test desde Postman
            const user_dto = new UserDto(req.user); 
            res.status(200).json({message: "Chat del usuario", user:user_dto});
        }else{
            res.redirect("/login");
        }
    }

    static async getProducts(req, res){
        try{
            if(req.user?.email){
                const params = req.query;
                const result = await ProductsService.getProducts(params);
                const {first_name, last_name, email, age, rol} = req.user; 
                const isAdmin = rol === config.admin.rol; 
                if(result.docs.length){
                    const data_products = ProductsService.getPaginateData(result, req);
                    res.render("products", {first_name, last_name, email, age, rol, isAdmin, products: data_products.payload, prevLink: data_products.prevLink, nextLink: data_products.nextLink, hasPrevPage: data_products.hasPrevPage, hasNextPage: data_products.hasNextPage});
                }else{
                    res.send("No se encontraron productos");
                }
            }else{
                res.redirect("/login");
            }
        }catch(error){
            res.json({status:"error", message:error.message});
        }
    }

    static renderSignup(req,res){
        if(req.user?.email){
            res.redirect("/profile");
        }else{
            res.render("signup");
        }
    }

    static renderLogin(req,res){
        if(req.user?.email){
            res.redirect("/profile");
        }else{
            res.render("login");
        }
    }

    static renderProfile(req,res){
        if(req.user?.email){
            const {first_name, last_name, email, age, rol} = req.user;
            const isAdmin = rol === config.admin.rol; 
            res.render("profile",{first_name, last_name, email, age, rol, isAdmin});
        } else {
            res.redirect("/login");
        }
    }

    static testLogger(req,res){
        logger.error("Logger Error");
        logger.info("Logger Info");
        logger.debug("Logger Debug");
        res.send("Testing Logger");
    }
}