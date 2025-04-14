import { getBoards,createBoard,deleteBoard, getBoardById } from "@/api/boardService";
import { Board } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";


export const useBoards = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(false);
    const [board, setBoard] = useState<Board>();

    useEffect(() => {
        let isMounted = true;
        const fetchBoards = async () => {
            try{
                setLoading(true);
                const data = await getBoards();
                //console.log(data)
                if(isMounted){
                    setBoards(data);
            }
            }catch(error){
                console.log('Erro ao buscar boards',error)
            }finally{
                if(isMounted){
                    setLoading(false);
                }
            }
           
        }

        fetchBoards();
        return () => {
            isMounted = false
        }
    }, [])

    const handleCreateBoard = async (boardData:{title:string,description:string, members:string[]}) => {
            try{
                setLoading(true);               
                const data = await createBoard(boardData)
                //console.log(data)
                setBoards((prev) => [...prev, data])                    
            }catch(error){
                console.log('Erro ao criar board',error)
            }finally{
                setLoading(false);
            }
    }

    const handleDeleteBoard = async (id:string) => {
        try{
            setLoading(true);
            await deleteBoard(id)
            setBoards((prevBoards) => prevBoards.filter((board:any) => board._id !== id));
        }catch(error){
            console.log('Erro ao deletar board',error)
        }finally{
            setLoading(false);
        }
    }

    const findOneBoard = useCallback(async(id:string) => {
        try{
            let isMounted = true;
            const board = await getBoardById(id);
            console.log(board)
            if(isMounted){
                setBoard(board);        
            }
            return () => {
                isMounted = false
            }
            //console.log(board)
        }catch(error){
            console.log('Erro ao buscar board',error)
        }
    },[])


    return {
        board,
        boards,
        loading,
        handleCreateBoard,
        handleDeleteBoard,
        findOneBoard
    }
}