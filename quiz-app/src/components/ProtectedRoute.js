import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, role }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log("🔍 Checking stored role:", storedRole);
        setUserRole(storedRole);
        setLoading(false);
    }, []);

    if (loading) return null;  
    if (!userRole) {
        console.log("No role found, redirecting to login");
        return <Navigate to="/login" />;
    }

    if (role && userRole !== role) {
        console.log(`Access denied: expected ${role}, found ${userRole}`);
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
