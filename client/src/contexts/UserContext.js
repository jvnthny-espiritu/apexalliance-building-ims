import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use named import here

// Create the UserContext
export const UserContext = createContext();

// UserProvider component
const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the JWT token
                const decodedToken = jwtDecode(token);
                
                // Ensure role is present in decoded token
                if (decodedToken && decodedToken.role) {
                    setUserRole(decodedToken.role);
                    localStorage.setItem('userRole', decodedToken.role); // Save role to localStorage
                }
            } catch (error) {
                console.error("Token decoding failed:", error);
                setUserRole(null);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ userRole }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider };
