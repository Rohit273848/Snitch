import axios from 'axios';

const CartApiInstance = axios.create({
    baseURL:"/api/cart"
})