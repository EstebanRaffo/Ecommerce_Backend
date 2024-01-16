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

    static uploadFiles(req, res){
        console.log("Entro en uploadFiles")
        console.log("req.params: ",req.params)
        console.log("req.body: ",req.body)
        console.log("req.file: ",req.file)
        console.log("req.files['avatar'][0]: ", req.files['avatar'][0])
        // console.log("req.files['documents']:", req.files['documents'])
        res.json({message: "Se actualizaron los documentos"})
    }
}