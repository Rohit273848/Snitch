import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"
import CreateProduct from "../features/products/pages/CreateProduct.jsx"
import SellerProduct from "../features/products/pages/SellerProduct.jsx"
import Home from "../features/products/pages/Home.jsx"
import Protected from "../features/auth/components/Protected.jsx"
import SellerProtected from "../features/auth/components/SellerProtected.jsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Home /></Protected>,
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
                element: <SellerProtected>
                    <CreateProduct />
                </SellerProtected>

            },
            {
                path: "products",
                element: <SellerProtected>
                    <SellerProduct />
                </SellerProtected>
            }
        ]
    }
])