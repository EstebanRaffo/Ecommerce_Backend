import { usersDao } from "../dao/index.js";

export class UsersService{

    static async getUser(email){
        try {
            const result = await usersDao.getUser(email);
            return result;    
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id){
        try {
            const result = await usersDao.getUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createUser(new_user){
        try {
            const result = await usersDao.createUser(new_user);
            return result;
        } catch (error) {
            throw error;
        }
    }
}