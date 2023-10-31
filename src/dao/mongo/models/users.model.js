import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique:true
    },
    age:Number,
    password:String,
    rol:{
        type:String,
        default:"usuario",
        required:true
    },
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
});

export const usersModel = mongoose.model(usersCollection,userSchema);