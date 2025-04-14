import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Board } from "@/lib/types";


type BoardProps = {
    board:Board
    onDelete: (id: string) => Promise<void> 
}


export const BoardCard = ({board, onDelete}:BoardProps,)=>{
    const navigate = useNavigate();
    const formattedDate = new Date(board.updatedAt).toLocaleDateString('pt-BR');
    //console.log(board )
  return(
    <Card 
      onClick={() => navigate(`/dashboard/${board._id}`,{state:{board}})} 
      className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Cabeçalho com título e botão de deletar */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {board.title}
        </CardTitle>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evita que o card seja clicável ao deletar
            onDelete(board._id);
          }} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </button>
      </CardHeader>            

      {/* Conteúdo com a descrição */}
      <CardContent>
        <p className="font-medium text-lg text-gray-700 dark:text-gray-300">
          {board.description}
        </p>
      </CardContent>                

      {/* Rodapé com o criador e a última atualização */}
      <CardFooter className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Criado por: <span className="font-semibold">{board.owner?.name}</span></p>
        <p>Última atualização: <span className="font-semibold">{formattedDate}</span></p>
      </CardFooter>
    </Card>     
  )
}

