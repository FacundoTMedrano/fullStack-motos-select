import { createContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState({
        role: null,
        accessToken: null,
        name: null,
        email: null,
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
