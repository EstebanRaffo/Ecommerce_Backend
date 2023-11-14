import { UsersService } from "../services/users.service.js";

export class UsersController{

    static async getUser(email){
        try {
            const result = await UsersService.getUser(email);
            res.status(200).json(result);
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    }
}