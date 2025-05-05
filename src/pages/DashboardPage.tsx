import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/boardHeader/DashboardHeader";
import { DashboardDetails } from "@/components/boardDetails/DashboardDetails";
import { useHandleGetOneBoard } from "@/hooks/actions/useBoardActions";
import { useBoardEmitter } from "@/hooks/socket/useBoardEmitter";
import { useSocket } from "@/hooks/socket/useSocket";
import { useBoardStore } from "@/store/useBoardStore";

export default function DashboardPage() {
  const socket = useSocket();
  const { emitJoinBoard, emitLeaveBoard } = useBoardEmitter(socket);
  const { id: boardId } = useParams<{ id: string }>();

  const handleGetOneBoard = useHandleGetOneBoard();
  const setCurrentBoardId = useBoardStore(state => state.setCurrentBoardId);
  const board = useBoardStore(state => state.board);

  const [loading, setLoading] = useState(true);

  // 1) Efeito de fetch: só dispara quando muda boardId
  useEffect(() => {
    if (!boardId) return;

    const doFetch = async () => {
      setLoading(true);
      await handleGetOneBoard(boardId);
      setLoading(false);
    };

    // Se já temos o board carregado, pule o fetch
    if (!board || board._id !== boardId) {
      doFetch();
    } else {
      setLoading(false);
    }
  }, [boardId, handleGetOneBoard, board]);

  // 2) Efeito de socket join/leave: só dispara quando muda boardId ou socket
  useEffect(() => {
    if (!boardId || !socket) return;
    setCurrentBoardId(boardId);
    emitJoinBoard(boardId);
    return () => {
      emitLeaveBoard(boardId);
    };
  }, [boardId, socket, emitJoinBoard, emitLeaveBoard, setCurrentBoardId]);

  if (loading) {
    return <div>Carregando board...</div>;
  }
  if (!board) {
    return <div>Board não encontrado.</div>;
  }

  return (
    <div className="mt-6 mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 max-w-8xl border rounded">
      <DashboardHeader board={board} />
      <DashboardDetails board={board} />
    </div>
  );
}
