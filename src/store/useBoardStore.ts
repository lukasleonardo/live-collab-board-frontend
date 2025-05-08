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
  setLiveUsers: (numUsers:number) => {
    console.log('setLiveUsers', numUsers);
    if(numUsers === get().liveUsers) return
    set({ liveUsers: numUsers })
  },
  
  setCurrentBoardId: (boardId) => set({ currentBoardId: boardId }),
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
  updateBoardLocally: (board) =>
    set((state) => ({
      boards: state.boards.map((b) => (b._id === board._id ? board : b)),
    })),
  setLoading: (value) => set({ loading: value }),
}));
