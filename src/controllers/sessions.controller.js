import { config } from "../config/config.js";
import UserDto from "../dao/dto/user.dto.js";
import { generateToken, verifyEmailToken, isValidPassword, createHash} from "../utils.js";
import { UsersService } from "../services/users.service.js";
import { transporter } from "../config/gmail.js";
import { logger } from "../helpers/logger.js";


export class SessionsController{

    static renderProfile = async (req,res)=>{
        const {first_name, last_name, email, age, rol} = req.user
        const isAdmin = rol === config.admin.rol; 
        res.render("profile",{message:"Usuario registrado correctamente", first_name, last_name, email, age, rol, isAdmin});
    }

    static renderFailSignup = (req,res)=>{
        res.render("signup",{error:"No se pudo registrar el usuario"});
    }

    static redirectToProducts = async(req,res)=>{
        // res.redirect("/products");

        // Para test de login desde Postman
        if(req.user?.email){
            const user_dto = new UserDto(req.user); 
            res.status(200).json({user:user_dto});
        }
    }

    static renderFailLogin = (req,res)=>{
        res.render("login",{error:"No se pudo iniciar sesion para el usuario"});
    }

    static logout = async(req,res)=>{
        try {
            req.session.destroy(err=>{
                if(err) return res.render("profile",{error:"No se pudo cerrar la sesion"});
                res.redirect("/login");
            })
        } catch (error) {
            res.render("profile",{error:"No se pudo cerrar la sesión"});
        }
    }

    static currentUser = (req,res)=>{
        if(req.user?.email){
            const user_dto = new UserDto(req.user); 
            res.status(200).json({user:user_dto});
        }else{
            res.redirect("/login");
        }
    }

    static async sendResetPasswordMail(req, res){
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
                logger.error(`sendResetPasswordMail: ${error.message}`);
                res.json({status:"error", message:error.message})
            }
        }    
    }

    static async resetPassword(req, res){
        try {
            const {token} = req.query;
            const {new_password} = req.body;
            const validEmail = verifyEmailToken(token);
            if(!validEmail){
                return res.send(`El enlace está expirado, click <a href="/forgot-password">aquí</a> para generar uno nuevo`);
            }
            const user = await UsersService.getUser(validEmail);
            if(!user){
                return res.send("Esta operación no es válida");
            }
            if(isValidPassword(new_password, user)){
                return res.render("resetPasswordForm", {error:"La nueva contraseña debe ser distinta de la anterior", token});
            }
            const result = await UsersService.updateUser(user._id, {password: createHash(new_password)});
            res.render("login",{message: "Usuario actualizado exitosamente", data: result});
            // res.status(201).json({message: "Usuario actualizado exitosamente", data: result});
        } catch (error) {
            logger.error(`resetPassword: ${error.message}`);
            res.json({status:"error", message:error.message});
        }
    }
}