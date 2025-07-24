import { ReactNode, useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export interface AuthProviderLoginProps {
    authToken: string;
    roleUser: string;
}
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    // Check for existing token in localStorage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('role');

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false); // <-- jika tidak ada token/role
        }

        setLoading(false);
    }, []);

    // Login function that accepts token and user data
    const login = (authToken: string, roleUser: string) => {
        setToken(authToken);
        setRole(roleUser);
        setIsAuthenticated(true);

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('role', roleUser);
    };

    // Logout function to clear everything
    const logout = () => {
        // Clear state
        setToken('');
        setIsAuthenticated(false);

        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
    };



    return (
        <AuthContext.Provider value={{ isAuthenticated, token, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};