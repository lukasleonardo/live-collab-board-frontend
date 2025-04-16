import { Board} from "@/lib/types";
import { EllipsisVertical, Pencil, Plus  } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TaskModal from "../boardDetails/TaskModal";
import { useState } from "react";
import { SearchBar } from "./Searchbar";
interface DashboardHeaderProps  {
    board:Board
  }
export const DashboardHeader = ({ board}:DashboardHeaderProps )=>{
    const [showModal, setShowModal] = useState(false);
    
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
                    <DropdownMenuItem className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer">
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

            {/* Barra de pesquisa abaixo */}
            <div className="mt-4 w-full max-w-[1000px] mx-auto">
                <SearchBar className="w-full mx-auto" placeholder="Pesquisar..." />
            </div>
        </div>

        {showModal && (
        <TaskModal
            lanes={board.lanes}
            open={showModal}
            onClose={() => setShowModal(false)} 
            boardId={board._id}        />
        )}
       
        </>
    )
}