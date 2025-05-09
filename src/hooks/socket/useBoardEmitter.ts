import { boardFormData } from "@/schemas/boardSchema";
import { useMemo, useCallback } from "react";
import { Socket } from "socket.io-client";
 // ajuste para seu import real

export const useBoardEmitter = (socket: Socket | null) => {
    const emitLeaveBoard = useCallback((boardId: string) => {
        socket?.emit('board:leave', boardId);
    }, [socket]);

    const emitJoinBoard = useCallback((boardId: string) => {
        socket?.emit('board:join', boardId);
    }, [socket]);

    const emitCreateBoard = useCallback((board: boardFormData) => {
        socket?.emit('board:create', { board });
    }, [socket]);

    const emitUpdateBoard = useCallback((board: any, boardId: string) => {
        socket?.emit('board:update',  board, boardId );
    }, [socket]);

    const emitDeleteBoard = useCallback((boardId: string) => {
        socket?.emit('board:delete', boardId);
    }, [socket]);

    return useMemo(() => ({
        emitLeaveBoard,
        emitJoinBoard,
        emitCreateBoard,
        emitUpdateBoard,
        emitDeleteBoard
    }), [emitLeaveBoard, emitJoinBoard, emitCreateBoard, emitUpdateBoard, emitDeleteBoard]);
};
