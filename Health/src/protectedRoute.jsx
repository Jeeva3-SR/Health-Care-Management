import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    console.log("ProtectedRoute Rendered");
console.log("Token:", localStorage.getItem("token"));
console.log("Role:", localStorage.getItem("userRole"));
console.log("Allowed:", allowedRole);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && role?.toUpperCase() !== allowedRole.toUpperCase()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;