import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";


export class UsersController{

    static async switchRol(req, res){
        const {uid} = req.params;
        try {
            const user = await UsersService.getUserById(uid);
            if(user.status !== "completo"){
                return res.json({status:"error", message:"El usuario no ha terminado de procesar su documentación"});
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
            res.json({status:"success", message:"Los documentos fueron cargados"});
        } catch (error) {
            logger.error(`uploadUserFiles: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }
}