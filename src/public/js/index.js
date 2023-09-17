const socketClient = io()

socketClient.on("product_list", (dataServer)=>{

});

socketClient.emmit("update_list", new_list);

socketClient.on("new_list", (dataServer)=>{

});