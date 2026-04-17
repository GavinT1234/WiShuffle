import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return; // don't connect until logged in

    const token = localStorage.getItem("token");
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },          // server reads socket.handshake.auth.token
      transports: ["websocket"],
    });

    socketRef.current.on("connect",    () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));

    return () => {
      socketRef.current?.disconnect(); // cleanup on logout / unmount
    };
  }, [user]); // reconnects if user changes

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);