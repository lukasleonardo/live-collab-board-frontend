import { Task } from "@/lib/types";
import { Socket } from "socket.io-client";

export const useTaskEmitter = (socket: Socket | null) => ({
    emitCreateTask: (task: Task, boardId: string) => socket?.emit('task:create', { task, boardId }),
    emitUpdateTask: (task: Task, boardId: string) => socket?.emit('task:update', { task, boardId }),
    emitDeleteTask: (taskId: string, boardId: string) => socket?.emit('task:delete', { taskId, boardId }),
    emitReorderTasks: (tasks: Task[],boardId:string) => socket?.emit('task:reorder', { tasks,boardId}),
});