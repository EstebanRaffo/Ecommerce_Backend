import { ticketsModel } from "../models/tickets.model.js";

// La compra debe corroborar el stock del producto al momento de finalizarse:
// Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del 
// producto y continuar.
// Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto 
// al proceso de compra. 
// Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
// En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
// Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. 
// Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.

export class TicketsManagerMongo{
    constructor(){
        this.model = ticketsModel;
    }

    async buyCart(ticket){
        try {
            
            const result = await this.model.create(ticket);
            return result;
        } catch (error) {
            console.log("buyCart: ", error.message);
            throw new Error("No se pudo concretar la compra");
        }
    }
}