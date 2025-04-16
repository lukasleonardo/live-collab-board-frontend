/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useTaskStore.ts
import { create } from 'zustand';
import { Task } from '@/lib/types';
import { createTask, deleteTask, getTasksByBoard, reorderTasks} from '@/api/taskService';
import { toast } from 'react-toastify';
import { TaskFormData } from '@/schemas/taskSchema';

interface TaskStore {
    tasks: Task[];
    loading: boolean;
    fetchTasks: (boardId: string) => Promise<void>;
    addTask: (taskData:TaskFormData) => Promise<void>;
    deleteTaskById: (id: string) => Promise<void>;
    reorder: (updatedTasks: Task[]) => Promise<void>;
    query: string;
    setQuery: (term: string) => void;
  }

  export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    loading: true,
    query: '',
    setQuery: (query) => set({ query }),
  
    fetchTasks: async (boardId) => {
      set({ loading: true });
      try {
        const data = await getTasksByBoard(boardId);
        set({ tasks: data });
        toast.success("Tasks carregadas com sucesso!");
      } catch (error) {
        console.error("Erro ao buscar tasks:", error);
        toast.error("Erro ao buscar tasks!");
      } finally {
        set({ loading: false });
      }
    },
  
    addTask: async (taskData:TaskFormData) => {
      try {
        const created = await createTask(taskData);
        set((state) => ({ tasks: [...state.tasks, created] }));
        toast.success("Tarefa criada com sucesso!");
      } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        toast.error("Erro ao criar tarefa!");
      }
    },
  
    deleteTaskById: async (id) => {
      try {
        await deleteTask(id);
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== id),
        }));
        toast.success("Tarefa deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        toast.error("Erro ao deletar tarefa!");
      }
    },
  
    reorder: async (updatedTasks) => {
      set({ tasks: updatedTasks });
      try {
        await reorderTasks(updatedTasks);
        toast.success("Tarefas reordenadas com sucesso!");
      } catch (error) {
        console.error("Erro ao reordenar tarefas:", error);
        toast.error("Erro ao reordenar tarefas!");
      }
    },
  }));