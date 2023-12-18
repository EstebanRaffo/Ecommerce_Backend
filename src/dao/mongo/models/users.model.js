import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    age:Number,
    password:{
        type:String,
        // required:true
    },
    rol:{
        type:String,
        default:"user",
        enum:["user","admin","premium"]
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
});

export const usersModel = mongoose.model(usersCollection,userSchema);