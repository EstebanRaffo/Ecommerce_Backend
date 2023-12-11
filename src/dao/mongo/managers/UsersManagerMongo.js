import { usersModel } from "../models/users.model.js";
import { logger } from "../../../helpers/logger.js";


export class UsersManagerMongo{
    constructor(){
        this.model = usersModel;
    }

    async getUser(email){   
        try {
            const user = await usersModel.findOne({email:email});
            return user;
        } catch (error) {
            logger.error(`getUsers: ${error.message}`);
            throw new Error("No se pudo consultar el usuario");
        }
    }

    async getUserById(id){
        try {
            const user = await usersModel.findById(id);
            return user;
        } catch (error) {
            logger.error(`getUserById: ${error.message}`);
            throw new Error("No se pudo obtener el usuario");
        }
    }

    async createUser(new_user){
        try {
            const result = await usersModel.create(new_user);
            return result;
        } catch (error) {
            logger.error(`createUser: ${error.message}`);
            throw new Error("No se pudo registrar el usuario");
        }
    }
}

