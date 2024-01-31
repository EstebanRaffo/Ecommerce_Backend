
const addToCart = (product_id)=>{
    const cart_id = '652aa0e9007357dde63f8c1e';
    const url = `http://localhost:8080/api/carts/${cart_id}/product/${product_id}`

    fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        // .then((response) => logger.info("Success:", response))
        .then((response) => alert(response.message))
}