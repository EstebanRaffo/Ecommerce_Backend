import { ticketsDao } from "../dao";

export class TicketsService{

    static async buyCart(cart_id){
        try {
            const result = await ticketsDao.buyCart(cart_id);
            return result;
        } catch (error) {
            throw error;
        }
    }
}