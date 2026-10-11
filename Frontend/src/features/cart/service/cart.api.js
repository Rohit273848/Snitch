import axios from 'axios';

const cartApiInstance = axios.create({
    baseURL:"/api/cart",
    withCredentials:true,
})

export async function addItemToCart({ productId, variantId, quantity = 1 }) {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`;
    const response = await cartApiInstance.post(url, { quantity });
    return response.data;
}

export async function getCart() {
    const response = await cartApiInstance.get("/");
    return response.data;
}