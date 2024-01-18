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
    documents:{
        type:[{
            name:{
                type:String,
                required:true
            },
            reference:{
                type:String,
                required:true
            }
        }],
        default:[]
    },
    status:{
        type: String,
        required:true,
        enum:["pendiente","incompleto","completo"],
        default:"pendiente"
    },
    avatar:{
        type:String,
        default:''
    },
    last_connection:{
        type: Date,
        default: null
    }
});

export const usersModel = mongoose.model(usersCollection,userSchema);