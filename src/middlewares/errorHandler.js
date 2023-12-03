import { EError } from "../services/errors/enums.js";

export const errorHandler = (error, req, res, next) => {
    switch(error.code){
        case EError.REQUIRED_DATA:
            res.json({status:"error", error:error.message});
            break;
        default:
            break;
    }
}