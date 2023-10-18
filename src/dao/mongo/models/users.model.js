import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    age:String,
    password:String,
    rol:{
        type:String,
        default:"usuario",
        required:true
    }
});

export const usersModel = mongoose.model(usersCollection,userSchema);