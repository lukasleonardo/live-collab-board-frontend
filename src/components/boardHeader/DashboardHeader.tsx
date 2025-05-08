import { Board} from "@/lib/types";
import { EllipsisVertical, Pencil, Plus  } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TaskModal from "../boardDetails/TaskModal";
import { useState } from "react";
import { SearchBar } from "./Searchbar";
import { BoardModal } from "../listBoardPage/BoardModal";
import { Badge } from "../ui/badge";
interface DashboardHeaderProps  {
    board:Board
    usersCount:number
  }
export const DashboardHeader = ({ board, usersCount}:DashboardHeaderProps )=>{
    const [showModal, setShowModal] = useState(false);
    const[showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState('');
    const handleEdit = () =>{ 
        setShowEditModal(true)
        setIsEditing(board._id)
    };
    return(
        <>
        <div className="px-6 py-4">
            {/* Título, descrição e elipse */}
            <div className="flex items-start justify-between">
                <div className="herder-info">
                <h1 className="text-3xl font-bold">Board: {board.title}</h1>
                <p className="text-gray-500">Descrição: {board.description}</p>
                </div>

                <DropdownMenu>
                <DropdownMenuTrigger className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md text-gray-500 hover:bg-gray-300 transition mt-1">
                    <span>
                    <EllipsisVertical className="h-6 w-6" />
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md p-2 z-50">
                    <DropdownMenuItem className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEdit()}>
                    <Pencil /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => setShowModal(true)}
                    >
                    <Plus /> Adicionar Tarefa
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-sm font-medium tabular-nums transition-all duration-500 ease-in-out">
                {usersCount}
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Ao vivo
                </Badge>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
            {/* Barra de pesquisa abaixo */}
            <div className="mt-4 w-full max-w-[1000px] mx-auto">
                <SearchBar className="w-full mx-auto" placeholder="Pesquisar..." />
            </div>
        </div>
        {/* Modal */}
            <BoardModal isEditing={isEditing} open={showEditModal}  onClose={()=>setShowEditModal(false)}/> 

        {showModal && (
        <TaskModal
            open={showModal}
            isEditing={''}
            onClose={() => setShowModal(false)} 
            />
        )}
       
        </>
    )
}