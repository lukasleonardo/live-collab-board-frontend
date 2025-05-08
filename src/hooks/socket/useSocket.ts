import { useEffect, useState} from "react";
import { io,Socket } from "socket.io-client";

const socketUrl = "http://localhost:5000";
export const useSocket = ():Socket|null => {
    const [socket, setSocket] = useState<Socket|null>(null);
    useEffect(() => {
        const newSocket = io(socketUrl,{
            transports: ['websocket','pooling'],
            reconnectionAttempts: 3,
        });
        setSocket(newSocket);
        newSocket.on('connect_error', (err) => {
            console.error('Erro de conexão:', err);
          });
        return () => {
            newSocket.disconnect();
        }
    },[])
    return socket
}