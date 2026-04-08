import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getSocket } from "../lib/socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const token = localStorage.getItem("token");
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        const s = getSocket(token);

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);
        const onError = (err) => console.error("[Socket] Error:", err);

        s.on("connect", onConnect);
        s.on("disconnect", onDisconnect);
        s.on("connect_error", onError);

        if (!s.connected) s.connect();

        setSocket(s);

        return () => {
            s.off("connect", onConnect);
            s.off("disconnect", onDisconnect);
            s.off("connect_error", onError);
            // Do NOT disconnect here — singleton persists across routes
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket must be inside SocketProvider");
    return ctx;
}