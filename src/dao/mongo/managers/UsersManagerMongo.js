import { config } from "../../../config/config.js";
import { usersModel } from "../models/users.model.js";


export class UsersManagerMongo{
    constructor(){
        this.model = usersModel;
    }

    async getUser(email){
        try {
            const user = await usersModel.findOne({email:email});
            return user;
        } catch (error) {
            console.log("getUsers: ", error.message);
            throw new Error("No se pudo consultar el usuario");
        }
    }

    async getUserById(id){
        try {
            const user = await usersModel.findById(id);
            return user;
        } catch (error) {
            console.log("getUserById: ", error.message);
            throw new Error("No se pudo obtener el usuario");
        }
    }

    isAdmin(loginForm){
        const {email, password} = loginForm;
        return email === config.admin.user && password === config.admin.password;
    }

    async createUser(new_user){
        try {
            const result = await usersModel.create(new_user);
            return result;
        } catch (error) {
            console.log("createUser: ", error.message);
            throw new Error("No se pudo registrar el usuario");
        }
    }
}

