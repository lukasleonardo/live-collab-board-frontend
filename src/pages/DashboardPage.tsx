import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/boardHeader/DashboardHeader";
import { DashboardDetails } from "@/components/boardDetails/DashboardDetails";
import { useBoardActions } from "@/hooks/actions/useBoardActions";
import { useBoardEmitter } from "@/hooks/socket/useBoardEmitter";
import { useBoardStore } from "@/store/useBoardStore";
import { useBoardSocketListeners } from "@/hooks/socket/useBoardSocketListeners";
import { useSocketContext } from "@/hooks/socket/SocketContext";

export default function DashboardPage() {
  const socket = useSocketContext();
  const { emitJoinBoard, emitLeaveBoard } = useBoardEmitter(socket);
  const { id: boardId } = useParams<{ id: string }>();
  const {getOneBoardHandler} = useBoardActions();
  const setCurrentBoardId = useBoardStore(state => state.setCurrentBoardId);
  const board = useBoardStore(state => state.board);
  const liveUsers = useBoardStore(state => state.liveUsers);
  useBoardSocketListeners(socket);
  const loading = useBoardStore(state => state.loading);
  useEffect(() => {
  if (!boardId) return;
    
  const doFetch = async () => {
    await getOneBoardHandler(boardId);
  };

  if (!board || board._id !== boardId) {
    doFetch();
  }
}, [boardId, getOneBoardHandler]);


  useEffect(() => {
    if (!boardId || !socket) return;
    setCurrentBoardId(boardId);
    emitJoinBoard(boardId);
    return () => {
      emitLeaveBoard(boardId);
    };
  }, [boardId, emitJoinBoard, emitLeaveBoard,  socket]);

  if (loading) {
    return <div>Carregando board...</div>;
  }
  if (!board) {
    return <div>Board não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <DashboardHeader board={board} usersCount={liveUsers} />
      <DashboardDetails board={board} />
    </div>
  );
}
