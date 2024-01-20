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
        console.log("Entró en uploadUserFiles")
        const { _id } = req.user;
        console.log("_id user logueado: ", _id.valueOf())
        const { uid } = req.params;
        console.log("id de params: ", uid)
        console.log("req.files: ", req.files);
        if(uid !== _id.valueOf()) return res.status(401).json({error: "El uid no corresponde al usuario logueado"});
        try {
            const user = await UsersService.getUserById(uid);
            let docs = user.documents;
            console.log("docs del usuario ya subidos: ", docs)
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            if(identificacion){
                console.log("identificacion: ", identificacion)
                // docs = this.updateDoc(docs, identificacion);
                const newDocs = docs.filter(doc=>doc.fieldname !== identificacion.fieldname);
                console.log("docs sin el doc anterior: ", newDocs)
                docs = [ ...newDocs ]; 
                docs.push({name:"identificacion", reference: identificacion.path});
            }
            if(domicilio){
                docs.push({name:"domicilio", reference: domicilio.path});
            }
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference: estadoDeCuenta.path});
            }
            console.log("docs totales a guardar: ", docs);
            // user.documents = docs;
            // if(docs.length < 3){
            //     user.status = "incompleto";
            // } else {
            //     user.status = "completo";
            // }
            // user.status = docs.length < 3 ? "incompleto" : "completo";
            // const status = this.getLevel(docs);

            const existeIdentificacion = docs.find(doc=>doc.fieldname==="identificacion")
            const existeDomicilio = docs.find(doc=>doc.fieldname==="domicilio")
            const existeEstadoDeCuenta = docs.find(doc=>doc.fieldname==="estadoDeCuenta")
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
            console.log("user_updated: ", user_updated);
            res.json({status:"success", message:"Los documentos fueron cargados"});
        } catch (error) {
            logger.error(`uploadUserFiles: ${error.message}`);
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static getLevel = (docs)=>{
        console.log("Entró en getLevel con docs: ", docs)
        const identificacion = docs.find(doc=>doc.fieldname==="identificacion")
        const domicilio = docs.find(doc=>doc.fieldname==="domicilio")
        const estadoDeCuenta = docs.find(doc=>doc.fieldname==="estadoDeCuenta")
        const level = identificacion && domicilio && estadoDeCuenta ? 
                        "completo"
                        :
                        identificacion && domicilio || identificacion && estadoDeCuenta || domicilio && estadoDeCuenta ? 
                        "incompleto"
                        :
                        "pendiente"; 
        return level;
    }

    static updateDoc(docs, newDoc){
        return docs.filter(doc=>doc.fieldname !== newDoc.fieldname);
    }
}