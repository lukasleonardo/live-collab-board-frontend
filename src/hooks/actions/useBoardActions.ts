import { createBoard, deleteBoard, getBoardById, getBoardsWithTaskCount, updateBoard } from "@/api/boardService";
import { boardFormData } from "@/schemas/boardSchema";
import { useBoardStore } from "@/store/useBoardStore";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useBoardEmitter } from "../socket/useBoardEmitter";
import { useSocketContext } from "../socket/SocketContext";

export const useBoardActions = () => {
  const socket = useSocketContext();
  const setBoards = useBoardStore(state => state.setBoards);
  const setBoard = useBoardStore(state => state.setBoard);
  const setLoading = useBoardStore(state => state.setLoading);
  const { emitUpdateBoard, emitCreateBoard, emitDeleteBoard } = useBoardEmitter(socket);
  const removeBoardLocally = useBoardStore(state => state.removeBoardLocally);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBoardsWithTaskCount();
      setBoards(data);
      toast.success("Boards carregados com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao buscar boards", err);
    } finally {
      setLoading(false);
    }
  }, [setBoards, setLoading]);

  const createBoardHandler = useCallback(async (boardData: boardFormData) => {
    setLoading(true);
    try {
      const newBoard = await createBoard(boardData);
      emitCreateBoard(newBoard);
      toast.success("Board criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar board", error);
      toast.error("Erro ao criar board!");
    } finally {
      setLoading(false);
    }
  }, [emitCreateBoard, setLoading]);

  const deleteBoardHandler = useCallback(async (boardId: string) => {
    setLoading(true);
    try {
      await deleteBoard(boardId);
      removeBoardLocally(boardId);
      emitDeleteBoard(boardId);
      toast.success("Board deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar board", error);
      toast.error("Erro ao deletar board!");
    } finally {
      setLoading(false);
    }
  }, [emitDeleteBoard, setLoading,removeBoardLocally]);

  const updateBoardHandler = useCallback(async (boardId: string, board: boardFormData) => {
    try {
      const updatedBoard = await updateBoard(boardId, board);
      console.log(updatedBoard, boardId);
      emitUpdateBoard(updatedBoard, boardId);
      toast.success("Board atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar board", error);
      toast.error("Erro ao atualizar board!");
    }
  }, [emitUpdateBoard]);

  const getOneBoardHandler = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await getBoardById(id);
      setBoard(data);
    } catch (err: any) {
      toast.error("Erro ao buscar board", err);
    } finally {
      setLoading(false);
    }
  }, [setBoard, setLoading]);





  return {
    fetchBoards,
    createBoardHandler,
    deleteBoardHandler,
    updateBoardHandler,
    getOneBoardHandler,
  };
};

