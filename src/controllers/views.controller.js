import { config } from "../config/config.js";
import { ProductsService } from "../services/products.service.js";
import UserDto from "../dao/dto/user.dto.js";
import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";

export class ViewsController{

    static renderHome(req, res){
        if(req.user?.email){
            res.render("home");
        }else{
            res.redirect("/login");
        }
    }

    static renderRealTimeProducts(req, res){
        if(req.user?.email){
            // const { rol } = req.user; 
            // const isAdmin = rol === config.admin.rol; 
            // res.render("realTimeProducts", {isAdmin});
            res.render("realTimeProducts");
        }else{
            res.redirect("/login");
        }
    }

    static async renderChat(req, res){
        if(req.user?.email){
            res.render("chat");

            // Para test desde Postman
            // const user_dto = new UserDto(req.user); 
            // res.status(200).json({message: "Chat del usuario", user:user_dto});
        }else{
            res.redirect("/login");
        }
    }

    static async getPaginatedProducts(req, res){
        try{
            if(req.user?.email){
                const params = req.query;
                const result = await ProductsService.getPaginatedProducts(params);
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
            logger.error(`getPaginatedProducts: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static renderSignup(req, res){
        if(req.user?.email){
            res.redirect("/profile");
        }else{
            res.render("signup");
        }
    }

    static renderLogin(req, res){
        if(req.user?.email){
            res.redirect("/profile");
        }else{
            res.render("login");
        }
    }

    static renderProfile(req, res){
        if(req.user?.email){
            const {_id, first_name, last_name, email, age, rol} = req.user;
            const uid = _id.valueOf();
            const isAdmin = rol === config.admin.rol; 
            res.render("profile",{first_name, last_name, email, age, rol, isAdmin, uid});
        } else {
            res.redirect("/login");
        }
    }

    static testLogger(req, res){
        logger.error("Logger Error");
        logger.info("Logger Info");
        logger.debug("Logger Debug");
        res.send("Testing Logger");
    }

    static renderForgotPassword(req, res){
        res.render("restorePasswordForm")
    }

    static async renderResetPassword(req, res){
        const {token} = req.query;
        res.render("resetPasswordForm", {token});
    }

    static renderDocumentsForm(req, res){
        if(req.user?.email){
            const { _id } = req.user;
            const uid = _id.valueOf();
            res.render("documents", { uid });
        } else {
            res.redirect("/login");
        }
    }

    static async renderUsers(req, res){
        try {
            if(req.user?.email){
                const users = await UsersService.getAllUsers();
                if(!users.length) return res.send("No se encontraron usuarios");
                const userList = users.map(user => {
                    return {
                        id: user._id,
                        fullname: `${user.first_name} ${user.last_name}`,
                        email: user.email,
                        rol: user.rol,
                        last_connection: user.last_connection.toLocaleDateString(),
                        status: user.status,
                        isAdmin: user.rol === config.admin.rol,
                        isNotComplete: user.status !== "completo"
                    }
                })
                res.render("users", {users: userList});
            }else{
                res.redirect("/login");
            }
        } catch (error) {
            logger.error(`renderUsers: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static renderCart(req, res){
        if(req.user?.email){
            const { rol } = req.user;
            const isAdmin = rol === config.admin.rol;
            res.render("cart", {isAdmin});
        }else{
            res.redirect("/login");
        }
    }
}