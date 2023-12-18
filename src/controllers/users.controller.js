import { UsersService } from "../services/users.service.js";


export class UsersController{

    static async switchRol(req, res){
        const {uid} = req.params;

        try {
            const user = await UsersService.getUserById(uid);
            console.log(user)
            const new_role = user.rol === "user" ? "premium" : "user";
            const userUpdated = await UsersService.updateUser(uid, {rol: new_role});
            res.status(200).json({message:"Usuario actualizado exitosamente", data: userUpdated});
        } catch (error) {
            res.json({status: "error", message:error.message});
        }
    }
}