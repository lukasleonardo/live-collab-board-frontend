import { Task } from "@/lib/types";
import { Socket } from "socket.io-client";

export const useTaskEmitter = (socket: Socket | null) => ({
    emitCreateTask: (task: Task, boardId: string) => socket?.emit('task:create', { task, boardId }),
    emitUpdateTask: (task: Task, boardId: string) => socket?.emit('task:update', { task, boardId }),
    emitDeleteTask: (id: string, boardId: string) => socket?.emit('task:delete', { id, boardId }),
    emitReorderTasks: (tasks: Task[]) => socket?.emit('task:reorder', { tasks}),
});