import { createTask, deleteTask, getTasksByBoard, reorderTasks } from "@/api/taskService";
import {Task} from "@/lib/types";
import { useEffect, useState } from "react";

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
        } catch (error) {
          console.error("Erro ao buscar tasks:", error);
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
        } catch (error) {
          console.error("Erro ao criar tarefa:", error);
        }
      };

   
    const handleDelete = async (id: string) => {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
      }
   };
   const handleDragEnd = async (
    updatedTasks: Task[],
  ) => {
    //console.log(updatedTasks)
    setTasks(updatedTasks);
    try {
      await reorderTasks(updatedTasks);
    } catch (error) {
      console.error("Erro ao reordenar tarefas:", error);
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
  