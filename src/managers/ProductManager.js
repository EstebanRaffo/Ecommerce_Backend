import fs from "fs";

export default class ProductManager{

    constructor(path){
        this.filePath = path
    }

    fileExist(){
        return fs.existsSync(this.filePath);
    }

    async getProducts(){
        try {
            if(this.fileExist()){
                //leer el archivo
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                //transformar string a json => JSON.parse(objetoJson)
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

    async isInProducts(code){
        const products = await this.getProducts()
        if(products){
            return products.some(product => product.code === code)
        }
        else{
            return false
        }
    }

    isValidProductData(title, description, price, code, stock, category, status){
        return title && description && typeof(price) === "number" && category && code && typeof(stock) === "number" && status
    }

    async addProduct(title, description, price, thumbnails, code, stock, category, status){
        try{
            if(!this.isValidProductData(title, description, price, code, stock, category, status)){
                return console.error("Hay datos obligatorios no informados")
            }else{
                if(await this.isInProducts(code)){
                    return console.error("El producto que intenta agregar ya existe")
                }
                else{
                    let newId;
                    const products = await this.getProducts();
                    if(!products.length){
                        newId = 1
                    }else{
                        newId = products[products.length - 1].id + 1
                    }
                    const new_product = {id: newId, title, description, price, thumbnails, code, stock, category, status};
                    await this.saveProduct(new_product)    
                }
            }
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }

    async saveProduct(productInfo){
        try {
            if(this.fileExist()){
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                const contenidoJson = JSON.parse(contenido);
                contenidoJson.push(productInfo);
                await fs.promises.writeFile(this.filePath,JSON.stringify(contenidoJson,null,"\t"));
                console.log("producto agregado");
            } else {
                throw new Error("no es posible guardar el producto")
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getProductById(id){
        try{
            const products = await this.getProducts()
            const product = products.find(product => product.id === id)
            if(!product){
                throw {name: 'client error', httpcode: 404, description: 'Producto no encontrado'}
            }
            return product;
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }

    async getCurrentId(){
        const products = await this.getProducts();
        return products[products.length - 1].id
    }

    async updateProduct(id, new_product_info){
        try{
            if(this.fileExist()){
                const fields = Object.keys(new_product_info);
                const productsString = await fs.promises.readFile(this.filePath, "utf-8");
                const productsJSON = JSON.parse(productsString);
                const productsJsonUpdated = productsJSON.map((product) => {
                    if(product.id === id){
                        fields.forEach(async field => {
                            console.log("product.hasOwnProperty(field): ", product.hasOwnProperty(field))
                            if(product.hasOwnProperty(field)){
                                product[field] = new_product_info[field];    
                            }
                            else{
                                throw new Error("El producto no tiene el dato especificado");
                            }
                        });
                        return product;
                    }else{ 
                        return product;
                    }
                })
                await fs.promises.writeFile(this.filePath, JSON.stringify(productsJsonUpdated, null, "\t"));
            }else{
                throw new Error("No es posible actualizar el producto. Archivo inexistente.")
            }
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }

    async productExists(id){
        const products = await this.getProducts();
        if(products){
            return products.some(product => product.id === id);
        }
        else{
            return false
        }
    }

    async deleteProduct(id){
        try{
            if(this.fileExist()){
                if(await this.productExists(id)){
                    const productsString = await fs.promises.readFile(this.filePath, "utf-8");
                    const productsJSON = JSON.parse(productsString);
                    const productsJsonUpdated = productsJSON.filter(product => product.id !== id);
                    await fs.promises.writeFile(this.filePath, JSON.stringify(productsJsonUpdated, null, "\t"));
                    console.log(`El producto Id: ${id} ha sido eliminado`)
                }
                else{
                    throw new Error("No existe el producto que desea eliminar");
                }
            }else{
                throw new Error("No es posible eliminar el producto");
            }
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }
}