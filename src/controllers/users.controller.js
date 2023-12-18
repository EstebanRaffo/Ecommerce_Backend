import { UsersService } from "../services/users.service";


export class UsersController{

    static async switchRole(req, res){
        const user = req.user;
        const {_id, rol} = user;
        new_role = rol === "user" ? "premium" : "user";
        try {
            const result = await UsersService.updateUser(_id, {rol: new_role});
            res.status(200).json(result);
        } catch (error) {
            res.json({status: "error", message:error.message});
        }

    }
}