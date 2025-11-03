import { createContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

type AuthContextType = {
    isAuthenticated: boolean;
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    setUser: () => {}
});

export function AuthProvider({children}: {children: ReactNode}) {
    const [user,setUser] = useState<string | null>(null)

    const refreshToken = async () => {
        try {
            const res = await api.post("auth/refresh/")
            const newAccess = res.data.access
            localStorage.setItem(ACCESS_TOKEN, newAccess)
            localStorage.setItem("first_name", res.data.first_name);
            setUser(res.data.first_name)
        } catch (error : any) {
            if (error.response && error.response.data && error.response.data.error.includes("expired") ) {
                alert ("votre session à expiré, veuillez vous connecter à nouveau")
                localStorage.removeItem(ACCESS_TOKEN)
                setUser(null)
            } else {
                alert("Erreur réseau ou serveur injoignable.")
            }
            localStorage.removeItem(ACCESS_TOKEN)
            setUser(null)
        }
    }

useEffect(() => {
    const access = localStorage.getItem(ACCESS_TOKEN);
    const user_name = localStorage.getItem("first_name");

    if (user_name && access) {
        try {
            const decoded: { exp: number } = jwtDecode(access);
            const expiration = decoded.exp * 1000;
            const now = Date.now();

            if (expiration > now) {
                setUser(user_name);
            } else {
                refreshToken();
            }
        } catch (err) {
            console.error("JWT invalide :", err);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem("first_name");
            console.log("authprovider useEffect catched error")
            setUser(null);
        }
    } else {
        localStorage.removeItem("first_name");
        setUser(null);
    }
}, []);


    return (
        <AuthContext.Provider value={{isAuthenticated : !!user, user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}