import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/login"

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
    }
])