import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";


export class UsersController{

    static async switchRol(req, res){
        const {uid} = req.params;

        try {
            const user = await UsersService.getUserById(uid);
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
            res.status(400).json({status: "error", message:error.message});
        }
    }

    static async uploadFiles(req, res){
        console.log("Entro en uploadFiles")
        console.log("req.params: ",req.params)
        console.log("req.file: ",req.file)
        const {uid} = req.params;
        const filename = req.file['filename'];
        const path = req.file['path'];
        const info = {
            documents:[{
                name:filename,
                reference:path
            }]
        }
        try {
            await UsersService.updateUser(uid, info)
            res.send({message: "Se actualizaron los documentos"});
        } catch (error) {
            logger.error(`${error.message}`);
            throw error;
        }
    }
}