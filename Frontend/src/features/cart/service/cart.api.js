import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const cartApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/cart`,
    withCredentials: true,
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

export async function IncrementItemCartQuantity({ productId, variantId }) {
    const url = variantId
        ? `/quantity/increment/${productId}/${variantId}`
        : `/quantity/increment/${productId}`;
    const response = await cartApiInstance.post(url);
    return response.data;
}

export async function DecrementItemCartQuantity({ productId, variantId }) {
    const url = variantId
        ? `/quantity/decrement/${productId}/${variantId}`
        : `/quantity/decrement/${productId}`;
    const response = await cartApiInstance.post(url);
    return response.data;
}