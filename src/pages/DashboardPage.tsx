// pages/dashboard/[id].tsx
import {DashboardDetails} from "@/components/boardDetails/DashboardDetails";
import { DashboardHeader } from "@/components/boardHeader/DashboardHeader";
import { useBoards } from "@/hooks/useBoards";
import { useTasks } from "@/hooks/useTasks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DashboardPage() {
  const {id:boardId} = useParams<{id:string}>();
  const {board,findOneBoard} = useBoards() 
   const {
      tasks,
      loading,
      handleAddTask,
      handleDelete,
      handleDragEnd,
    } = useTasks(boardId!);
  useEffect(() => {
    const fetchBoard = async () => {
      if (boardId) {
        await findOneBoard(boardId);
      }
    };
  
     fetchBoard();
  }, [boardId,findOneBoard]);
  
  if (!board) {
    return <div>Carregando...</div>; // ou um spinner bonitinho
  }
  return (
    <div className="mt-6 mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 max-w-8xl border rounded">
      <DashboardHeader board={board!} tasks={tasks!} onAddTask={handleAddTask} />
      <DashboardDetails tasks={tasks} loading={loading} handleAddTask={handleAddTask} handleDelete={handleDelete} handleDragEnd={handleDragEnd} board={board!} />
    </div>
  );
}
