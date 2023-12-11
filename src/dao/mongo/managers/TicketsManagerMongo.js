import { ticketsModel } from "../models/tickets.model.js";
import { logger } from "../../../helpers/logger.js";


export class TicketsManagerMongo{
    constructor(){
        this.model = ticketsModel;
    }

    async buyCart(ticket){
        try {
            const result = await this.model.create(ticket);
            return result;
        } catch (error) {
            logger.error(`buyCart: ${error.message}`);
            throw new Error("No se pudo concretar la compra");
        }
    }
}