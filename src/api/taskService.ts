import { api } from "@/api/api";

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

export const reorderTasks = async (tasks: any[]) => {
  await api.patch('/tasks/reorder', {
    tasks: tasks.map((task ) => ({
      id: task._id,
      order: task.order,
      laneId: task.laneId
    })),
  });
};
