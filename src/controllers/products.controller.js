import { ProductsService } from "../services/products.service.js"
import { generateProduct } from "../helpers/mocks.js";
import CustomError from "../services/errors/customError.service.js";
import { EError } from "../services/errors/enums.js";
import { createProductErrorInfo } from "../services/errors/info.js";
import { transporter } from "../config/gmail.js";
import { config } from "../config/config.js";
import { UsersService } from "../services/users.service.js";
import { logger } from "../helpers/logger.js";


export class ProductsController{

    static async getProducts(req, res){
        try{
            const query_params = req.query;
            const result = await ProductsService.getProducts(query_params);
            if(!result.docs.length) res.send("No se encontraron productos");
            const data_products = ProductsService.getPaginateData(result, req);
            res.status(200).json(data_products.payload);   
        }catch(error){
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async getProductById(req, res){
        const id = req.params.pid;
        try{
            const product = await ProductsService.getProductById(id);
            if(!product) res.send("No se encontró el producto buscado o no existe");
            res.status(200).json(product);            
        }catch(error){
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async createProduct(req, res){
        const {email} = req.user;
        const {title, description, price, code, stock, category, status} = req.body;
        const isValidData = title && description && price && code && stock && category && status;
        try{
            if(!isValidData){
                CustomError.createError({
                    name:"Error en Alta de Producto",
                    cause:createProductErrorInfo(req.body),
                    message:"Uno o más datos obligatorios no fueron informados",
                    code:EError.REQUIRED_DATA
                })
            }
            const fieldname = req.files[0]?.['fieldname'] || null;
            let thumbnails = [];
            if(fieldname == 'thumbnails'){
                const path = req.files[0]['path']
                thumbnails.push(path)
            }
            const dataProduct = {
                ...req.body,
                owner: email,
                thumbnails
            }
            const new_product = await ProductsService.createProduct(dataProduct);
            res.status(201).json({message: "El producto fue creado exitosamente", data: new_product});
        }catch(error){
            res.status(400).json({status:"error", message: error.message});
        }
    }

    static async updateProduct(req, res){
        const id = req.params.pid;
        const new_product_info = req.body;
        try{
            const product_updated = await ProductsService.updateProduct(id, new_product_info);
            res.status(201).json({message: "Producto actualizado exitosamente", data: product_updated});
        }catch(error){
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async deleteProduct(req, res){
        const pid = req.params.pid;
        const user = req.user;
        try{
            await ProductsController.belongsToPremiumAndNotify(pid);
            await ProductsService.deleteProduct(pid, user);
            res.status(201).json({message: "Producto eliminado exitosamente"});
        }catch(error){
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static async belongsToPremiumAndNotify(pid){
        try {
            const product = await ProductsService.getProductById(pid);
            if(!product) throw new Error("No existe el producto buscado");
            if(product.owner !== config.admin.rol){
                const userOwner = await UsersService.getUser(product.owner);
                if(!userOwner) throw new Error("No se encontró el owner del producto o fue eliminado por inactividad");
                if(userOwner.rol === "premium") await ProductsController.sendNotifyMailDeleteProduct(userOwner.email, product);
            }
        } catch (error) {
            logger.error(`belongsToPremiumAndNotify: ${error.message}`);
            throw error;
        }
    }

    static async sendNotifyMailDeleteProduct(emails, product){
        const {title, description, price, code, category, owner} = product;
        try {
            const emailTemplate = () => `
                    <div>
                        <h2>Hola estimado usuario de Ecommerce</h2>
                        <p>El siguiente producto ha sido eliminado de la plataforma</p>
                        <ul>
                            <li>Nombre: ${title}</li>
                            <li>Descripción: ${description}</li>
                            <li>Precio: $ ${price}</li>
                            <li>Código: ${code}</li>
                            <li>Categoría: ${category}</li>
                            <li>Creador: ${owner}</li>
                        </ul>
                    </div>
            `;
            const result = await transporter.sendMail({
                from:config.gmail.account,
                to:emails,
                subject:"Producto eliminado del Ecommerce",
                html:emailTemplate()
            });
            logger.info("Notificación de eliminación de producto: ", result);
        } catch (error) {
            logger.error(`sendNotifyMailDeleteProduct: ${error.message}`);
            throw error;
        }
    }

    static generateProducts(req, res){
        let products = [];
        for(let i = 0; i < 100; i++){
            const new_product = generateProduct();
            products.push(new_product);
        }
        res.json({status:"success", data: products});
    }
}