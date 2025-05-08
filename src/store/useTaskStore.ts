import { create } from 'zustand';
import { Task } from '@/lib/types';

interface TaskStore {
  tasks: Task[];
  task?: Task;
  loading: boolean;
  query:string,
  setTask: (task: Task) => void;
  setQuery: (term: string) => void;
  setTasks: (tasks: Task[]) => void;
  addTaskLocally: (task: Task) => void;
  removeTaskLocally: (taskId: string) => void;
  updateTaskLocally: (task: Task) => void;
  setLoading: (value: boolean) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  task: undefined,
  loading: false,
  query: '',
  setQuery: (query) => set({ query }),
  setTask: (task) => set({ task }),
  setTasks: (tasks) => set({ tasks }),
  addTaskLocally: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  removeTaskLocally: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    })),
updateTaskLocally: (updatedTask) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t._id === updatedTask._id ? updatedTask : t
    ),
  })),

  setLoading: (value) => set({ loading: value }),
}));
