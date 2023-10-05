import { messagesModel } from "../models/messages.model.js";

export class ChatManagerMongo{
    constructor(){
        this.model = messagesModel;
    }

    async getMessages(){
        try {
            const messages = await this.model.find();
            return messages;
        } catch (error) {
            console.log("getMessages: ", error.messages);
            throw new Error("No se pudieron obtener los mensajes");
        }
    }

    async createMessage(message){
        try {
            const result = await this.model.create(message);
            return result;
        } catch (error) {
            console.log("createMessage: ", error.message);
            throw new Error("No se pudo enviar el mensaje");
        }
    }
}