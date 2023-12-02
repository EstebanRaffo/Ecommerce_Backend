import {faker} from "@faker-js/faker";

const { database, commerce, string, image, number } = faker;

export const generateProduct = () => {
    return {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        thumbnails:[image.url(), image.url(), image.url()],
        code: string.alphanumeric(5),
        stock: number.int(100),
        category: commerce.product(),
        status: true
    }
}