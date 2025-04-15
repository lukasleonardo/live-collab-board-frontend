import { createTask, deleteTask, getTasksByBoard, reorderTasks } from "@/api/taskService";
import {Task} from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// hooks/useTasks.ts
export const useTasks = (boardId: string) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      if (!boardId) return;
  
      const fetchTasks = async () => {
        setLoading(true);
        try {
          const data = await getTasksByBoard(boardId);
          setTasks(data);
          toast.success("Tasks carregadas com sucesso!");
        } catch (error) {
          console.error("Erro ao buscar tasks:", error);
          toast.error("Erro ao buscar tasks!");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, [boardId]);

  

      const handleAddTask = async (taskData: {
        title: string;
        description: string;
        members: string[];
        laneId: string;
        order: number;
      }) => {
        if (!boardId) return;
    
        const newTask = {
          ...taskData,
          boardId,
        };
    
        try {
          const created = await createTask(newTask);
          setTasks((prev) => [...prev, created]);
          toast.success("Tarefa criada com sucesso!");
        } catch (error) {
          console.error("Erro ao criar tarefa:", error);
          toast.error("Erro ao criar tarefa!");
        }
      };

   
    const handleDelete = async (id: string) => {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((task) => task._id !== id));
        toast.success("Tarefa deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        toast.error("Erro ao deletar tarefa!");
      }
   };
   const handleDragEnd = async (
    updatedTasks: Task[],
  ) => {
    //console.log(updatedTasks)
    setTasks(updatedTasks);
    try {
      await reorderTasks(updatedTasks);
      toast.success("Tarefas reordenadas com sucesso!");
    } catch (error) {
      console.error("Erro ao reordenar tarefas:", error);
      toast.error("Erro ao reordenar tarefas!");
    }
  };

  

    return {
      tasks,
      loading,
      handleAddTask,
      handleDelete,
      handleDragEnd,      
    };
  };
  