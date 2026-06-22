import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("/api/v1/users/currentuser");
                if (!mounted) return;
                setUser(res.data?.data ?? null);
            } catch (err) {
                if (!mounted) return;
                setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchCurrentUser();
        return () => { mounted = false; };
    }, []);

    const login = async (credentials) => {
        const res = await axios.post("/api/v1/users/login", credentials);
        setUser(res.data?.data ?? null);
        return res;
    };

    const logout = async () => {
        try {
            await axios.post("/api/v1/users/logout", {});
        } catch (e) {
            // ignore if backend doesn't implement logout
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};