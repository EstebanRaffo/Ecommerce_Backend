import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
        unique:true
    },
    message:{
        type:String,
        required:true
    }
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);

