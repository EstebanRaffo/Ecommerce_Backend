export const createProductErrorInfo = (product) => {
    return ` 
        Uno o más datos obligatorios no fueron informados.
        Los siguientes datos son obligatorios:
        * title: Se esperaba un valor de tipo Sring. Se recibió: ${product.title}
        * description: Se esperaba un valor de tipo Sring. Se recibió: ${product.description}
        * price: Se esperaba un valor de tipo Numérico. Se recibió: ${product.price}
        * code: Se esperaba un valor de tipo Sring. Se recibió: ${product.code}
        * stock: Se esperaba un valor de tipo Numérico. Se recibió: ${product.stock}
        * category: Se esperaba un valor de tipo Sring. Se recibió: ${product.category}
        * status: Se esperaba un valor de tipo Boleano. Se recibió: ${product.status}
    `
}