import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    thumbnails:{
        type: []
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["notebooks","tablets","homeoffice"]
    },
    status:{
        type:Boolean,
        required: true
    }
});

productSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection, productSchema);