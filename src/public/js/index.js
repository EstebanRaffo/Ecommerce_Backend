const socketClient = io()

const productList = document.getElementById("productList");
const createProductForm = document.getElementById("createProductForm");

createProductForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const formData = new FormData(createProductForm);

    const jsonData = {};
    for(const [key,value] of formData.entries()){
        jsonData[key]=value
    };
    jsonData.price = parseInt(jsonData.price);

    socketClient.emit("new_product", jsonData);
    createProductForm.reset();
});

socketClient.on("product_list", (dataProducts)=>{
    let list = "";
    dataProducts.forEach(product => {
        list += 
        `<li>
            <p>${product.title}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: ${product.price}</p>
            <button onclick="deleteProduct(${product.id})">Eliminar</button>
        </li>`
    });
    productList.innerHTML = list;
});

const deleteProduct = (id) => {
    console.log(id)
    socketClient.emit("delete_product", id);
}