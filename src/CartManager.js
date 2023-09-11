import fs from "fs";


export default class CartManager{

    constructor(path){
        this.filePath = path
    }

    fileExist(){
        return fs.existsSync(this.filePath);
    }

    async getCarts(){
        try {
            if(this.fileExist()){
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                const contenidoJson = JSON.parse(contenido);
                return contenidoJson;
            } else {
                throw new Error("no es posible leer el archivo")
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async createCart(products){
        try{
            if(this.fileExist()){
                let newId;
                const carts = await this.getCarts();
                if(!carts.length){
                    newId = 1
                }else{
                    newId = carts[carts.length - 1].id + 1
                }
                const new_cart = {id: newId, products};
                await this.saveCart(new_cart);
                return new_cart;
            } else {
                throw new Error("No se pudieron obtener los carritos");
            }
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }

    async saveCart(cartInfo){
        try {
            if(this.fileExist()){
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                const contenidoJson = JSON.parse(contenido);
                contenidoJson.push(cartInfo);
                await fs.promises.writeFile(this.filePath,JSON.stringify(contenidoJson,null,"\t"));
                console.log("carrito agregado");
            } else {
                throw new Error("no es posible guardar el carrito")
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getProductsCart(id){
        try{
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === id);
            return cart.products;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    isInCart(products_cart, prod_id){
        return products_cart.some(product => product.id === prod_id)
    }

    async addProductToCart(cart_id, prod_id){
        try{
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cart_id)
            if(this.isInCart(cart.products, prod_id)){
                const new_carts_list = carts.map(cart => {
                    if(cart.id === cart_id){
                        const new_products_list = cart.products.map(product => {
                            if(product.id === prod_id){
                                product.quantity++;
                            }else{
                                return product;
                            }
                        });
                        cart.products = new_products_list;
                        return cart;
                    }else{
                        return cart;
                    }
                });
                await fs.promises.writeFile(this.filePath, JSON.stringify(new_carts_list, null, "\t"));
            }else{
                const new_carts_list = carts.map(cart => {
                    if(cart.id === cart_id){
                        cart.products.push({id: prod_id, quantity: 1})
                        return cart;
                    }else{
                        return cart;
                    }
                });
                await fs.promises.writeFile(this.filePath, JSON.stringify(new_carts_list, null, "\t"));
            }   
        }catch (error) {
            console.log(error.message);
            throw error;
        }
    }
}  