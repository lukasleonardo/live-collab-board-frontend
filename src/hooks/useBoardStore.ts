import { create } from "zustand";
import { getBoards, createBoard, deleteBoard, getBoardById } from "@/api/boardService";
import { Board } from "@/lib/types";
import { toast } from "react-toastify";
import { boardFormData } from "@/schemas/boardSchema";

type BoardStore = {
  boards: Board[];
  board?: Board;
  loading: boolean;
  fetchBoards: () => Promise<void>;
  handleCreateBoard: (data: boardFormData) => Promise<void>;
  handleDeleteBoard: (id: string) => Promise<void>;
  findOneBoard: (id: string) => Promise<void>;
};

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  board: undefined,
  loading: false,

  fetchBoards: async () => {
    set({ loading: true });
    try {
      const data = await getBoards();
      set({ boards: data });
      toast.success("Boards carregados com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar boards", error);
      toast.error("Erro ao buscar boards!");
    } finally {
      set({ loading: false });
    }
  },

  handleCreateBoard: async (boardData: boardFormData) => {
    set({ loading: true });
    try {
      const newBoard = await createBoard(boardData);
      set((state) => ({ boards: [...state.boards, newBoard] }));
      toast.success("Board criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar board", error);
      toast.error("Erro ao criar board!");
    } finally {
      set({ loading: false });
    }
  },

  handleDeleteBoard: async (id) => {
    set({ loading: true });
    try {
      await deleteBoard(id);
      set((state) => ({
        boards: state.boards.filter((board) => board._id !== id),
      }));
      toast.success("Board deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar board", error);
      toast.error("Erro ao deletar board!");
    } finally {
      set({ loading: false });
    }
  },

  findOneBoard: async (id) => {
    try {
      const board = await getBoardById(id);
      set({ board });
    } catch (error) {
      console.error("Erro ao buscar board", error);
      toast.error("Erro ao buscar board!");
    }
  },
}));
