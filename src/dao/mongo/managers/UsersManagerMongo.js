import { usersModel } from "../models/users.model.js";
import { logger } from "../../../helpers/logger.js";


export class UsersManagerMongo{
    constructor(){
        this.model = usersModel;
    }

    async getUser(email){   
        try {
            const user = await this.model.findOne({email:email});
            return user;
        } catch (error) {
            logger.error(`getUsers: ${error.message}`);
            throw new Error("No se pudo consultar el usuario");
        }
    }

    async getUserById(id){
        try {
            const user = await this.model.findById(id);
            return user;
        } catch (error) {
            logger.error(`getUserById: ${error.message}`);
            throw new Error("No se pudo obtener el usuario");
        }
    }

    async createUser(new_user){
        try {
            const result = await this.model.create(new_user);
            return result;
        } catch (error) {
            logger.error(`createUser: ${error.message}`);
            throw new Error("No se pudo registrar el usuario");
        }
    }

    async updateUser(id, info){
        try {
            const result = await this.model.findByIdAndUpdate(id, info, {new:true});
            return result;
        } catch (error) {
            logger.error(`updateUser: ${error.message}`);
            throw new Error("No se pudo actualizar el usuario");
        }
    }

    async getAllUsers(){
        try {
            const result = await this.model.find();
            return result;
        } catch (error) {
            logger.error(`getAllUsers: ${error.message}`);
            throw new Error("No se pudieron obtener los usuarios");
        }
    }

    async deleteUsers(inactive_users_ids){
        try {
            const result = await this.model.deleteMany({ _id: {$in: inactive_users_ids} });
            return result;
        } catch (error) {
            logger.error(`deleteUsers: ${error.message}`);
            throw new Error("No se pudieron eliminar los usuarios inactivos");
        }
    }
}

