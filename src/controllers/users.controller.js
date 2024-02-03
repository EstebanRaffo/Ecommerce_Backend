import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";
import UserDto from "../dao/dto/user.dto.js";
import { transporter } from "../config/gmail.js";
import { config } from "../config/config.js";


export class UsersController{

    static async switchRol(req, res){
        const {uid} = req.params;
        try {
            const user = await UsersService.getUserById(uid);
            if(user.status !== "completo") throw new Error("El usuario no ha terminado de procesar su documentación");
            let new_role;
            switch(user.rol){
                case 'user':
                    new_role = "premium";
                    break;
                case 'premium':
                    new_role = 'user';
                    break;
                default:
                    throw new Error("El Rol del usuario no es válido. No es posible cambiarlo.");
            }
            const userUpdated = await UsersService.updateUser(uid, {rol: new_role});
            res.status(201).json({message:"Usuario actualizado exitosamente", data: userUpdated});
        } catch (error) {
            logger.error(`switchRol: ${error.message}`);
            res.status(400).json({status: "error", message:error.message});
        }
    }

    static async uploadUserFiles(req, res){
        const { _id } = req.user;
        const { uid } = req.params;
        if(uid !== _id.valueOf()) return res.status(401).json({error: "El id del usuario no corresponde al autenticado"});
        try {
            const user = await UsersService.getUserById(uid);
            let docs = user.documents;
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            if(identificacion){
                const newDocs = docs.filter(doc=>doc.name !== identificacion.fieldname);
                docs = [ ...newDocs ]; 
                docs.push({name:"identificacion", reference: identificacion.path});
            }
            if(domicilio){
                const newDocs = docs.filter(doc=>doc.name !== domicilio.fieldname);
                docs = [ ...newDocs ]; 
                docs.push({name:"domicilio", reference: domicilio.path});
            }
            if(estadoDeCuenta){
                const newDocs = docs.filter(doc=>doc.name !== estadoDeCuenta.fieldname);
                docs = [ ...newDocs ]; 
                docs.push({name:"estadoDeCuenta", reference: estadoDeCuenta.path});
            }

            const existeIdentificacion = docs.find(doc=>doc.name==="identificacion")
            const existeDomicilio = docs.find(doc=>doc.name==="domicilio")
            const existeEstadoDeCuenta = docs.find(doc=>doc.name==="estadoDeCuenta")
            const status = existeIdentificacion && existeDomicilio && existeEstadoDeCuenta ? 
                        "completo"
                        :
                        existeIdentificacion && existeDomicilio || existeIdentificacion && existeEstadoDeCuenta 
                        || existeDomicilio && existeEstadoDeCuenta ? 
                        "incompleto"
                        :
                        "pendiente"; 

            const info = {
                documents: docs,
                status
            }
            const user_updated = await UsersService.updateUser(user._id, info);
            res.status(201).json({status:"success", message:"Los documentos fueron cargados", data: user_updated});
        } catch (error) {
            logger.error(`uploadUserFiles: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async getAllUsers(req, res){
        try {
            const users = await UsersService.getAllUsers();
            let usersDto = []
            users.forEach(user => {
                usersDto.push(new UserDto(user));
            });
            res.status(200).json({status:"success", data: usersDto});
        } catch (error) {
            logger.error(`getAllUsers: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async deleteInactiveUsers(req, res){
        try {
            const inactive_users = await UsersController.getInactiveUsers();
            if(!inactive_users.length) throw new Error("No se encontraron cuentas inactivas");  
            const inactive_users_ids = inactive_users.map(user => user._id);
            const result = await UsersService.deleteUsers(inactive_users_ids);
            const inactive_users_emails = inactive_users.map(user => user.email);
            await UsersController.sendNotifyMail(inactive_users_emails);
            res.status(201).json({message: "Los usuarios inactivos fueron eliminados", data: result})
        } catch (error) {
            logger.error(`deleteInactiveUsers: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async getInactiveUsers(){
        try {
            const all_users = await UsersService.getAllUsers();
            const hoy = new Date(); 
            let diferencia_en_dias;
            let diferencia_en_miliSeg;
            return all_users.filter(user => {
                const last_connection = new Date(user.last_connection);
                diferencia_en_miliSeg = hoy.getTime() - last_connection.getTime();
                diferencia_en_dias = Math.round(diferencia_en_miliSeg / (1000 * 60 * 60 * 24));
                return diferencia_en_dias > 2;
            });
        } catch (error) {
            logger.error(`getInactiveUsers: ${error.message}`);
            throw error;
        }
    }

    static async sendNotifyMail(emails){
        try {
            const emailTemplate = () => `
                    <div>
                        <h2>Hola estimado usuario de Ecommerce</h2>
                        <p>Su cuenta ha sido eliminada por inactividad</p>
                    </div>
            `;
            const result = await transporter.sendMail({
                from:config.gmail.account,
                to:emails,
                subject:"Cuenta eliminada por Inactividad",
                html:emailTemplate()
            });
            logger.info("Notificaciones de eliminación de cuenta: ", result)
        } catch (error) {
            logger.error(`sendNotifyMail: ${error.message}`);
            throw error;
        }
    }
}