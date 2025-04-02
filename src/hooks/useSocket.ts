import { useEffect, useState} from "react";
import { io,Socket } from "socket.io-client";

const socketUrl = "http://localhost:5000";
export const useSocket = ():Socket|null => {
    const [socket, setSocket] = useState<Socket|null>(null);
    useEffect(() => {
        const newSocket = io(socketUrl);
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        }
    },[])
    return socket
}