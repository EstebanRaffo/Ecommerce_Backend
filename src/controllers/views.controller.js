import { config } from "../config/config.js";
import { generateToken, verifyEmailToken, isValidPassword, createHash} from "../utils.js";
import { ProductsService } from "../services/products.service.js";
import { UsersService } from "../services/users.service.js";
import UserDto from "../dao/dto/user.dto.js";
import { logger } from "../helpers/logger.js";
import { transporter } from "../config/gmail.js";

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
            const {first_name, last_name, email, age, rol} = req.user;
            const isAdmin = rol === config.admin.rol; 
            res.render("profile",{first_name, last_name, email, age, rol, isAdmin});
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

    static renderRestorePassword(req, res){
        res.render("restorePasswordForm")
    }

    static async sendRestorePasswordMail(req, res){
        const {email} = req.body;
        const user = await UsersService.getUser(email);
        if(!user){
            res.render("restorePasswordForm", {message: "El Email informado no pertenece a una cuenta registrada"});
        }else{
            const {first_name, last_name} = user;
            const domain = `${req.protocol}://${req.get('host')}`;
            const token = generateToken(user);
            const link = `${domain}/reset-password-form?token=${token}`;
            const emailTemplate = (first_name, last_name)=> `
                <div>
                    <h2>Hola ${first_name} ${last_name}!</h2>
                    <p>Click en el siguiente botón para restablecer contraseña</p>
                    <a href="${link}">
                        <button>
                            Restablecer contraseña
                        </button>
                    </a>
                </div>
            `;
            try {
                const result = await transporter.sendMail({
                    from:config.gmail.account,
                    to:email,
                    subject:"Restablece tu contraseña",
                    html:emailTemplate(first_name, last_name)
                });
                res.render("restorePasswordAdvise", {email, domain});
            } catch (error) {
                logger.error(`sendRestorePasswordMail: ${error.message}`);
                res.json({status:"error", message:error.message})
            }
        }    
    }

    static async renderResetPasswordForm(req, res){
        const {token} = req.query;
        res.render("resetPasswordForm", {token});
    }

    static async resetPassword(req, res){
        try {
            const {token} = req.query;
            const {new_password} = req.body;
            const validEmail = verifyEmailToken(token);
            if(!validEmail){
                return res.send(`El enlace está expirado, click <a href="/restore-password">aquí</a> para generar uno nuevo`);
            }
            const user = await UsersService.getUser(validEmail);
            if(!user){
                return res.send("Esta operación no es válida");
            }
            if(isValidPassword(new_password, user)){
                return res.render("resetPasswordForm", {error:"La nueva contraseña debe ser distinta de la anterior", token});
            }
            const result = await UsersService.updateUser(user._id, {password: createHash(new_password)});
            res.render("login",{message: "Usuario actualizado exitosamente"});
            // res.status(201).json({message: "Usuario actualizado exitosamente", data: result});
        } catch (error) {
            logger.error(`resetPassword: ${error.message}`);
            res.json({status:"error", message:error.message});
        }
    }
}