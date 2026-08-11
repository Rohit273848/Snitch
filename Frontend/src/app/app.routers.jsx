import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"
import CreateProduct from "../features/products/pages/CreateProduct.jsx"
import SellerProduct from "../features/products/pages/SellerProduct.jsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Hello world</h1>,

    }, {
        path: '/register',
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/seller",
        children: [
            {
                path: "create-product",
                element: <CreateProduct />
            },
            {
                path: "products",
                element: <SellerProduct />
            }
        ]
    }
])