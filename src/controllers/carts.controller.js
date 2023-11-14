import { CartsService } from "../services/carts.service.js";

export class CartsController{
    
    static async getCarts(req, res){
        try {
            
        } catch (error) {
            res.json({status: "error", message:error.message});
        }
    }
}