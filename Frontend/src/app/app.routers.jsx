import { createBrowserRouter, Outlet } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"
import CreateProduct from "../features/products/pages/CreateProduct.jsx"
import SellerProduct from "../features/products/pages/SellerProduct.jsx"
import SellerProductModel from "../features/products/pages/SellerProductModel.jsx"
import Home from "../features/products/pages/Home.jsx"
import ProductModal from "../features/products/pages/ProductModal.jsx"
import CartPage from "../features/cart/pages/CartPage.jsx"
import Protected from "../features/auth/components/Protected.jsx"
import SellerProtected from "../features/auth/components/SellerProtected.jsx"
import Nav from "../shared/components/Nav.jsx"

export const router = createBrowserRouter([
    {
        path: '/register',
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        element: (
            <>
                <Nav />
                <Outlet />
            </>
        ),
        children: [
            {
                path: "/",
                element: <Protected><Home /></Protected>,
            },
            {
                path: "/product/:id",
                element: <Protected><ProductModal /></Protected>,
            },
            {
                path: "/cart",
                element: <Protected><CartPage /></Protected>,
            },
            {
                path: "/chat",
                element: <Protected><CartPage /></Protected>,
            },
        ]
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
                path: "dashboard",
                element: <SellerProtected>
                    <SellerProduct />
                </SellerProtected>
            },
            {
                path: "product/:id",
                element: <SellerProtected>
                    <SellerProductModel />
                </SellerProtected>
            }
        ]
    }
])