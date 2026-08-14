import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loading } from "../../../components/ui";

const SellerProtected = ({ children }) => {
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    if (loading) {
        return <Loading   fullScreen message="Authenticating session..." />;
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not a seller
    if (user.role !== "seller") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default SellerProtected;