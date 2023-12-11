import { messagesModel } from "../models/messages.model.js";
import { logger } from "../../../helpers/logger.js";


export class ChatManagerMongo{
    constructor(){
        this.model = messagesModel;
    }

    async getMessages(){
        try {
            const messages = await this.model.find();
            return messages;
        } catch (error) {
            logger.error(`getMessages: ${error.message}`);
            throw new Error("No se pudieron obtener los mensajes");
        }
    }

    async createMessage(message){
        try {
            const result = await this.model.create(message);
            return result;
        } catch (error) {
            logger.error(`createMessage: ${error.message}`);
            throw new Error("No se pudo enviar el mensaje");
        }
    }
}