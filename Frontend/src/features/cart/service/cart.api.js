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

export async function removeCartItem({ productId, variantId, itemId }) {
    let url;
    if (productId && variantId) {
        url = `/remove/${productId}/${variantId}`;
    } else if (productId) {
        url = `/remove/${productId}`;
    } else if (itemId) {
        url = `/item-id/${itemId}`;
    } else {
        throw new Error("Product ID or Item ID is required to remove cart item");
    }

    const response = await cartApiInstance.delete(url, {
        params: { itemId },
        data: { productId, variantId, itemId }
    });
    return response.data;
}

export const deleteCartItem = removeCartItem;

// ─── Address Layer APIs ────────────────────────────────────────────────────────
export async function getAddresses() {
    const response = await cartApiInstance.get("/address");
    return response.data;
}

export async function createAddress(addressData) {
    const response = await cartApiInstance.post("/address", addressData);
    return response.data;
}

export async function updateAddress(addressId, addressData) {
    const response = await cartApiInstance.put(`/address/${addressId}`, addressData);
    return response.data;
}

export async function deleteAddress(addressId) {
    const response = await cartApiInstance.delete(`/address/${addressId}`);
    return response.data;
}

export async function selectCartAddress(addressId) {
    const response = await cartApiInstance.post(`/address/select/${addressId}`);
    return response.data;
}

export async function clearCartAddress() {
    const response = await cartApiInstance.delete("/address/select");
    return response.data;
}