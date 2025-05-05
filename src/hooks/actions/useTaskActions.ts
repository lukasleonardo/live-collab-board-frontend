import { useTaskStore } from '../../store/useTaskStore';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByBoard,
  reorderTasks,
  updateTask,
} from '@/api/taskService';
import { toast } from 'react-toastify';
import { TaskFormData } from '@/schemas/taskSchema';
import { useSocket } from '../socket/useSocket';
import { useCallback } from 'react';
import { useTaskEmitter } from '../socket/useTaskEmitter';
import { Task } from '@/lib/types';

export const useTaskActions = () => {
  const socket = useSocket();
  const { emitCreateTask, emitUpdateTask, emitDeleteTask, emitReorderTasks } = useTaskEmitter(socket);

  const {
    setTasks,
    addTaskLocally,
    removeTaskLocally,
    updateTaskLocally,
    setLoading,
  } = useTaskStore();

  const fetchTasks = useCallback(async (boardId: string) => {
    setLoading(true);
    try {
      const data = await getTasksByBoard(boardId);
      setTasks(data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar tarefas');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setTasks]);

  const handleGetTaskById = useCallback(async (id: string) => {
    try {
      const data = await getTaskById(id);
      return data;
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar tarefa');
      return null;
    }
  }, []);

  const handleAddTask = useCallback(async (taskData: TaskFormData, boardId: string) => {
    try {
      const created = await createTask(taskData);
      addTaskLocally(created);
      emitCreateTask(created, boardId);
      toast.success('Tarefa criada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar tarefa');
    }
  }, [addTaskLocally, emitCreateTask]);

  const handleDeleteTask = useCallback(async (id: string, boardId: string) => {
    try {
      await deleteTask(id);
      removeTaskLocally(id);
      emitDeleteTask(id, boardId);
      toast.success('Tarefa deletada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao deletar tarefa');
    }
  }, [removeTaskLocally, emitDeleteTask]);

  const handleReorderTasks = useCallback(async (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    try {
      await reorderTasks(updatedTasks);
      emitReorderTasks(updatedTasks);
      toast.success('Tarefa movida!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao reordenar tarefas');
    }
  }, [setTasks, emitReorderTasks]);

  const handleUpdateTask = useCallback(async (id: string, data: TaskFormData, boardId: string) => {
    try {
      const updated = await updateTask(id, data);
      updateTaskLocally(updated);
      emitUpdateTask(updated, boardId);
      toast.success('Tarefa atualizada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar tarefa');
    }
  }, [updateTaskLocally, emitUpdateTask]);

  return {
    fetchTasks,
    handleAddTask,
    handleDeleteTask,
    handleReorderTasks,
    handleUpdateTask,
    handleGetTaskById,
  };
};
