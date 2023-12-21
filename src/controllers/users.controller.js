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
            res.json({status: "error", message:error.message});
        }
    }
}