export default class ProductDto{
    constructor(product){
        this.id = product._id.valueOf();
        this.title = product.title;
        this.price = product.price;
        this.code = product.code;
    }
}