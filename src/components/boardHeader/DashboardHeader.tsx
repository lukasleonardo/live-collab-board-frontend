import { Board} from "@/lib/types";
import { EllipsisVertical, Pencil, Plus  } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TaskModal from "../boardDetails/TaskModal";
import { useState } from "react";
import { SearchBar } from "./Searchbar";
import { BoardModal } from "../listBoardPage/BoardModal";
import { Badge } from "../ui/badge";
import { useBoardStore } from "@/store/useBoardStore";
interface DashboardHeaderProps  {
    board:Board
    usersCount:number
  }
export const DashboardHeader = ({ board, usersCount}:DashboardHeaderProps )=>{
    const [showModal, setShowModal] = useState(false);
    const[showEditModal, setShowEditModal] = useState(false);
    const currentBoardId = useBoardStore(state => state.currentBoardId);
    const handleEdit = () =>{ 
        setShowEditModal(true)
    };
    return(
        <>              
    <header className="bg-white border-b shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Board: {board.title}</h1>
              <p className="text-slate-500 mt-1">Descrição: {board.description}</p>
              <div className="flex items-center mt-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Ao vivo
                    </Badge>
                    <Badge variant="outline" className="ml-2 bg-slate-50 text-slate-600 border-slate-200">
                    {usersCount} usuário ativo
                    </Badge>
                    </div>
            </div>
            <div className="dropdown">
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
          </div>
          <div className="mt-6 relative">       
            <SearchBar className="w-full mx-auto" placeholder="Pesquisar..." />
          </div>      
        </div>
      </header>
        {/* Modal */}
            <BoardModal isEditing={currentBoardId!} open={showEditModal}  onClose={()=>setShowEditModal(false)}/> 
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

