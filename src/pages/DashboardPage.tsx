// pages/dashboard/[id].tsx
import {DashboardDetails} from "@/components/boardDetails/DashboardDetails";
import { DashboardHeader } from "@/components/boardHeader/DashboardHeader";
import { useBoardStore } from "@/hooks/useBoardStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DashboardPage() {
  const {id:boardId} = useParams<{id:string}>();
  const {board,findOneBoard} = useBoardStore()
  useEffect(() => {
      if (!boardId) return;
      findOneBoard(boardId);
  }, [boardId,findOneBoard]);
  
  if (!board) {
    return <div>Carregando...</div>; // ou um spinner bonitinho
  }
  return (
    <div className="mt-6 mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 max-w-8xl border rounded">
      <DashboardHeader board={board!}  />
      <DashboardDetails board={board!} />
    </div>
  );
}
