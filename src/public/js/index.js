const socketClient = io()

const productList = document.getElementById("productList");

socketClient.on("product_list", (dataProducts)=>{
    let list = "";
    dataProducts.forEach(product => {
        list += 
        `<li>
            <p>${product.title}</p>
        </li>`
    });
    productList.innerHTML = list;
});

socketClient.emmit("update_list", new_list);

socketClient.on("new_list", (dataProducts)=>{

});