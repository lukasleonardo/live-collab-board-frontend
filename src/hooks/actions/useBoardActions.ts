import { useBoardStore } from "@/store/useBoardStore";
import { useCallback } from "react";
import { createBoard, deleteBoard, getBoardById, getBoards, updateBoard } from "@/api/boardService";
import { toast } from "react-toastify";
import { boardFormData } from "@/schemas/boardSchema";

export const useFetchBoards = () => {
  const setBoards = useBoardStore(state => state.setBoards);
  const setLoading = useBoardStore(state => state.setLoading);

  return useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBoards();
      setBoards(data);
      toast.success("Boards carregados com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao buscar boards",err);
    } finally {
      setLoading(false);
    }
  }, [setBoards, setLoading]);
};

export const useHandleCreateBoard = () => {
  const addBoardLocally = useBoardStore(state => state.addBoardLocally);
  const setLoading = useBoardStore(state => state.setLoading);

  return useCallback(async (boardData: boardFormData) => {
    setLoading(true);
    try {
      const newBoard = await createBoard(boardData);
      addBoardLocally(newBoard);
      toast.success("Board criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar board", error);
      toast.error("Erro ao criar board!");
    } finally {
      setLoading(false);
    }
  }, [addBoardLocally, setLoading]);
};

export const useHandleDeleteBoard = () => {
  const removeBoardLocally = useBoardStore(state => state.removeBoardLocally);
  const setLoading = useBoardStore(state => state.setLoading);

  return useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteBoard(id);
      removeBoardLocally(id);
      toast.success("Board deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar board", error);
      toast.error("Erro ao deletar board!");
    } finally {
      setLoading(false);
    }
  }, [removeBoardLocally, setLoading]);
};

export const useHandleUpdateBoard = () => {
  const updateBoardLocally = useBoardStore(state => state.updateBoardLocally);

  return useCallback(async (id: string, data: any) => {
    try {
      const updatedBoard = await updateBoard(id, data);
      updateBoardLocally(updatedBoard);
      toast.success("Board atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar board", error);
      toast.error("Erro ao atualizar board!");
    }
  }, [updateBoardLocally]);
};

export const useHandleGetOneBoard = () => {
  const setBoard = useBoardStore(state => state.setBoard);
  const setLoading = useBoardStore(state => state.setLoading);

  return useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await getBoardById(id);
      setBoard(data);
    } catch (err: any) {
      toast.error("Erro ao buscar board",err);
    } finally {
      setLoading(false);
    }
  }, [setBoard, setLoading]);
};
