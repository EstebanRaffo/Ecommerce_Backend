import { ticketsDao } from "../dao/index.js";

export class TicketsService{

    static async buyCart(ticket){
        try {
            const result = await ticketsDao.buyCart(ticket);
            return result;
        } catch (error) {
            throw error;
        }
    }
}