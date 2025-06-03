import { useEffect } from 'react';
import { Board } from '@/lib/types';
import { useBoardStore } from '@/store/useBoardStore';
import { Socket } from 'socket.io-client';
import { getBoardsWithTaskCount } from '@/api/boardService';

export const useBoardSocketListeners = (socket: Socket|null) => {
  const {
    removeBoardLocally,
    updateBoardLocally,
    setLiveUsers,
    setBoards
  } = useBoardStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);
  useEffect(() => {
    if (!socket) return;

    const handleUpdateLiveUsers = ({ count }: { count: number }) => {
      console.log(`Usuários online neste board: ${count}`);
      setLiveUsers(count);
    }; 

    const handleBoardCreated =async () => {
      const data = await getBoardsWithTaskCount();
      setBoards(data);
    };

    const handleBoardDeleted = (boardId:string) => {
      console.log('board deleted', boardId);
      removeBoardLocally(boardId);
    };

    const handleBoardUpdated = ({board,boardId: incomingBoardId}: {board: Board,boardId: string}) => {
      if (incomingBoardId !== currentBoardId) return;
      console.log('board updated', board, incomingBoardId)
      updateBoardLocally(board);
    };


    socket.on('board:users', handleUpdateLiveUsers);
    socket.on('board:created', handleBoardCreated);
    socket.on('board:deleted',handleBoardDeleted );
    socket.on('board:updated', handleBoardUpdated);

    return () => {
      socket.off('board:users', handleUpdateLiveUsers);
      socket.off('board:created', handleBoardCreated);
      socket.off('board:deleted', handleBoardDeleted);
      socket.off('board:updated', handleBoardUpdated);
    };

   
  }, [currentBoardId, removeBoardLocally, setBoards, setLiveUsers, socket, updateBoardLocally]);
};

