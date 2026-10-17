import { createBrowserRouter, Outlet } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"
import CreateProduct from "../features/products/pages/CreateProduct.jsx"
import SellerDashboard from "../features/products/pages/SellerDashboard.jsx"
import SellerProduct from "../features/products/pages/SellerProduct.jsx"
import SellerProductModel from "../features/products/pages/SellerProductModel.jsx"
import Home from "../features/products/pages/Home.jsx"
import SearchResultsPage from "../features/products/pages/SearchResultsPage.jsx"
import ProductModal from "../features/products/pages/ProductModal.jsx"
import CartPage from "../features/cart/pages/CartPage.jsx"
import OrdersListPage from "../features/orders/pages/OrdersListPage.jsx"
import OrderTrackingPage from "../features/orders/pages/OrderTrackingPage.jsx"
import OrderSuccessPage from "../features/orders/pages/OrderSuccessPage.jsx"
import SellerOrdersPage from "../features/orders/pages/SellerOrdersPage.jsx"
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
                path: "/search",
                element: <Protected><SearchResultsPage /></Protected>,
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
            {
                path: "/orders",
                element: <Protected><OrdersListPage /></Protected>,
            },
            {
                path: "/account",
                element: <Protected><OrdersListPage /></Protected>,
            },
            {
                path: "/account/orders",
                element: <Protected><OrdersListPage /></Protected>,
            },
            {
                path: "/orders/:id",
                element: <Protected><OrderTrackingPage /></Protected>,
            },
            {
                path: "/order-success/:id",
                element: <Protected><OrderSuccessPage /></Protected>,
            },
        ]
    },
    
    {
        path: "/seller",
        children: [
            {
                path: "",
                element: <SellerProtected>
                    <SellerDashboard />
                </SellerProtected>
            },
            {
                path: "dashboard",
                element: <SellerProtected>
                    <SellerDashboard />
                </SellerProtected>
            },
            {
                path: "products",
                element: <SellerProtected>
                    <SellerProduct />
                </SellerProtected>
            },
            {
                path: "catalog",
                element: <SellerProtected>
                    <SellerProduct />
                </SellerProtected>
            },
            {
                path: "orders",
                element: <SellerProtected>
                    <SellerOrdersPage />
                </SellerProtected>
            },
            {
                path: "create-product",
                element: <SellerProtected>
                    <CreateProduct />
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