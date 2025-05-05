import { boardFormData } from "@/schemas/boardSchema";
import { useMemo } from "react";
import { Socket } from "socket.io-client";

export const useBoardEmitter = (socket: Socket | null) => {
    return useMemo(() => ({
        emitLeaveBoard: (id: string) => socket?.emit('board:leave', { id }),
        emitJoinBoard: (id: string) => socket?.emit('board:join', { id }),
        emitCreateBoard: (data: boardFormData) => socket?.emit('board:create', { data }),
        emitUpdateBoard: (id: string, data: any) => socket?.emit('board:update', { id, data }),
        emitDeleteBoard: (id: string) => socket?.emit('board:delete', { id }), 
    }), [socket])
};