import { useEffect } from 'react';
import { Task } from '@/lib/types';
import { useTaskStore } from '../../store/useTaskStore';
import { useBoardStore } from '@/store/useBoardStore';
import { Socket } from 'socket.io-client';

export const useTaskSocketListeners = (socket: Socket|null) => {
  const {
    setTasks,
    addTaskLocally,
    removeTaskLocally,
    updateTaskLocally,
  } = useTaskStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);

  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = ({task,boardId: incomingBoardId}: {task: Task,boardId: string}) => {
      if (incomingBoardId !== currentBoardId) return;
      addTaskLocally(task);
    };

    const handleTaskDeleted = (taskId: string) => {
      removeTaskLocally(taskId);
    };

    const handleTaskUpdated = (task: Task) => {
      updateTaskLocally(task);
    };

    const handleTasksReordered = (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:deleted', handleTaskDeleted);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:reordered', handleTasksReordered);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:deleted', handleTaskDeleted);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:reordered', handleTasksReordered);
    };
  }, [addTaskLocally, removeTaskLocally, setTasks, socket, updateTaskLocally, currentBoardId]);
};

