import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/boardHeader/DashboardHeader";
import { DashboardDetails } from "@/components/boardDetails/DashboardDetails";
import { useHandleGetOneBoard } from "@/hooks/actions/useBoardActions";
import { useBoardEmitter } from "@/hooks/socket/useBoardEmitter";
import { useBoardStore } from "@/store/useBoardStore";
import { useBoardSocketListeners } from "@/hooks/socket/useBoardSocket";
import { useSocketContext } from "@/hooks/socket/SocketContext";

export default function DashboardPage() {
  const socket = useSocketContext();
  const { emitJoinBoard, emitLeaveBoard } = useBoardEmitter(socket);
  const { id: boardId } = useParams<{ id: string }>();
  const handleGetOneBoard = useHandleGetOneBoard();
  const setCurrentBoardId = useBoardStore(state => state.setCurrentBoardId);
  const board = useBoardStore(state => state.board);
  const liveUsers = useBoardStore(state => state.liveUsers);
  useBoardSocketListeners(socket);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) return;

    const doFetch = async () => {
      setLoading(true);
      await handleGetOneBoard(boardId);
      setLoading(false);
    };

    if (!board || board._id !== boardId) {
      doFetch();
    } else {
      setLoading(false);
    }
  }, [boardId, handleGetOneBoard, board]);

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
      <DashboardHeader board={board} usersCount={liveUsers} />
      <DashboardDetails board={board} />
    </div>
  );
}
