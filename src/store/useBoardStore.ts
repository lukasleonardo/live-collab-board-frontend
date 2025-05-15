import { Board } from "@/lib/types";
import { create } from "zustand";

interface BoardStore {
  boards: Board[];
  board?: Board;
  loading: boolean;
  currentBoardId?: string;
  liveUsers: number;
  setLiveUsers: (users: number) => void;
  setCurrentBoardId: (boardId: string) => void;
  setBoard: (board: Board) => void;
  setBoards: (board: Board[]) => void;
  addBoardLocally: (board: Board) => void;
  removeBoardLocally: (boardId: string) => void;
  updateBoardLocally: (board: Board) => void;
  setLoading: (value: boolean) => void;
}


export const useBoardStore = create<BoardStore>((set, get) => ({
  boards: [],
  board: undefined,
  loading: false,
  currentBoardId: undefined,
  liveUsers: 0,

  
  setLoading: (value) => set({ loading: value }),
  setLiveUsers: (numUsers:number) => {
    console.log('setLiveUsers', numUsers);
    if(numUsers === get().liveUsers) return
    set({ liveUsers: numUsers })
  },
  
  setCurrentBoardId: (boardId) => {
    if (get().currentBoardId !== boardId) {
      set({ currentBoardId: boardId });
    }
  },

  setBoard: (newBoard) => 
    set((state) => {
      if (state.board?._id !== newBoard._id) {
        return { board: newBoard };
      }
      return state;
    }),
  
    setBoards: (newBoards) =>
      set((state) => {
        const sameLength = state.boards?.length === newBoards.length;
        const sameIds = sameLength && state.boards.every((b, i) => b._id === newBoards[i]._id);
        
        if (!sameIds) {
          return { boards: newBoards };
        }
        return state;
      }),
    
  addBoardLocally: (board) =>
    set((state) => ({ boards: [...state.boards, board] })),
  removeBoardLocally: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((b) => b._id !== boardId),
    })),
  updateBoardLocally: (updatedBoard) =>
    set((state) => {
      const updatedBoards = state.boards.map((b) =>
        b._id === updatedBoard._id ? { ...b, ...updatedBoard } : b
      );

      const isCurrentBoard = state.board?._id === updatedBoard._id;

      return {
        boards: updatedBoards, 
        board: isCurrentBoard ? { ...state.board, ...updatedBoard } : state.board,
      };
    }),



}));
