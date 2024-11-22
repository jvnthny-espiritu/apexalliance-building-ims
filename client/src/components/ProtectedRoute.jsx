import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ requiredRoles }) => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    
    if (user && !requiredRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;