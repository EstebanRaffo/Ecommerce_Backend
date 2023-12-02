export const createProductErrorInfo = (product) => {
    return ` 
        Uno o más datos no fueron informados o son inválidos.
        Los siguientes datos son obligatorios:
        * Se esperaba un valor de tipo Sring y se recibió ${product.title}
        * Se esperaba un valor de tipo Sring y se recibió ${product.description}
        * Se esperaba un valor de tipo Numérico y se recibió ${product.price}
        * Se esperaba un valor de tipo Sring y se recibió ${product.code}
        * Se esperaba un valor de tipo Numérico y se recibió ${product.stock}
        * Se esperaba un valor de tipo Sring y se recibió ${product.category}
        * Se esperaba un valor de tipo Boleano y se recibió ${product.status}
    `
}