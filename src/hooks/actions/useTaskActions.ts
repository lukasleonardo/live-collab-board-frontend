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
import { useCallback } from 'react';
import { useTaskEmitter } from '../socket/useTaskEmitter';
import { Task } from '@/lib/types';
import { useSocketContext } from '../socket/SocketContext';

export const useTaskActions = (boardId: string) => {
  const socket = useSocketContext();
  const { emitCreateTask, emitUpdateTask, emitDeleteTask, emitReorderTasks } = useTaskEmitter(socket);

  const {
    setTask,
    setTasks,
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
      setTask(data)
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar tarefa');
      return null;
    }
  }, [setTask]);

  const handleAddTask = useCallback(async (taskData: TaskFormData, boardId: string) => {
    try {
      const created = await createTask(taskData);
      emitCreateTask(created, boardId);
      toast.success('Tarefa criada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar tarefa');
    }
  }, [ emitCreateTask]);

  const handleDeleteTask = useCallback(async (taskId: string, boardId: string) => {
    console.log('handleDeleteTask', taskId, boardId);
    try {
      await deleteTask(taskId);
      emitDeleteTask(taskId, boardId);
      toast.success('Tarefa deletada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao deletar tarefa');
    }
  }, [ emitDeleteTask]);

  const handleReorderTasks = useCallback(async (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    try {
      await reorderTasks(updatedTasks);
      emitReorderTasks(updatedTasks,boardId);
      toast.success('Tarefa movida!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao reordenar tarefas');
    }
  }, [setTasks, emitReorderTasks, boardId]);

  const handleUpdateTask = useCallback(async (id: string, data: TaskFormData, boardId: string) => {
    console.log('handleUpdateTask', id, data, boardId);
    try {
      const updated = await updateTask(id, data);;
      emitUpdateTask(updated, boardId);
      toast.success('Tarefa atualizada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar tarefa');
    }
  }, [ emitUpdateTask]);

  return {
    fetchTasks,
    handleAddTask,
    handleDeleteTask,
    handleReorderTasks,
    handleUpdateTask,
    handleGetTaskById,
  };
};
