import { ticketsModel } from "../models/tickets.model.js";


export class TicketsManagerMongo{
    constructor(){
        this.model = ticketsModel;
    }

    async buyCart(cart_id){
        try {
            const result = await this.model.create(info);
            return result;
        } catch (error) {
            console.log("buyCart: ", error.message);
            throw new Error("No se pudo concretar la compra");
        }
    }
}