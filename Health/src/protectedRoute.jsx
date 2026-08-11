import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    const normalizedRole = role?.replace("ROLE_", "").toUpperCase();
    const normalizedAllowedRole = allowedRole?.replace("ROLE_", "").toUpperCase();

    if (normalizedAllowedRole && normalizedRole !== normalizedAllowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;