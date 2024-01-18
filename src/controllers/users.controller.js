import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";


export class UsersController{

    static async switchRol(req, res){
        const {uid} = req.params;

        try {
            const user = await UsersService.getUserById(uid);
            if(user.status !== "completo"){
                return res.json({status:"error", message:"El usuario no ha subido todos los documentos"});
            }

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
            res.status(200).json({message:"Usuario actualizado exitosamente", data: userUpdated});
        } catch (error) {
            logger.error(`switchRol: ${error.message}`);
            res.status(400).json({status: "error", message:error.message});
        }
    }

    static async uploadUserFiles(req, res){
        try {
            const { uid } = req.params;
            const user = await UsersService.getUserById(uid);
            // console.log("documentos", req.files);
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            const docs = [];
            if(identificacion){
                docs.push({name:"identificacion", reference: identificacion.filename});
            }
            if(domicilio){
                docs.push({name:"domicilio", reference: domicilio.filename});
            }
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference: estadoDeCuenta.filename});
            }
            // console.log("docs", docs);
            // user.documents = docs;
            const info = {
                documents: docs
            }
            if(docs.length < 3){
                user.status = "incompleto";
            } else {
                user.status = "completo";
            }
            // console.log("user", user);
            await UsersService.updateUser(user._id, info);
            res.json({status:"success", message:"Los documentos fueron cargados"});
        } catch (error) {
            logger.error(`uploadUserFiles: ${error.message}`);
            res.json({status:"error", message:error.message});
        }
    }
}