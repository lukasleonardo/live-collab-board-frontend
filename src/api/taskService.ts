import { api } from "@/api/api";
import { Task } from "@/lib/types";

export const getTasksByBoard = async (boardId: string) => {
  const response = await api.get(`/tasks/board/${boardId}`);
  return response.data;
};

export const createTask = async (data: any) => {
  const response = await api.post(`/tasks`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};

export const reorderTasks = async (tasks: Task[]) => {
  await api.patch('/tasks/reorder', {
    tasks: tasks.map((task ) => ({
      id: task._id,
      order: task.order,
      laneId: task.laneId
    })),
  });
};

export const updateTask = async (id: string, data: any) => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};