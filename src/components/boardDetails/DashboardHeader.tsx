import { Board, Task } from "@/lib/types";
import { EllipsisVertical, Pencil, Plus  } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TaskModal from "./TaskModal";
import { useState } from "react";
interface DashboardHeaderProps  {
    board:Board
    tasks: Task[],
    onAddTask: (task: any) => void
  }
export const DashboardHeader = ({ board,tasks, onAddTask}:DashboardHeaderProps )=>{
    const [showModal, setShowModal] = useState(false);
    
    return(
        <>
        <div className="flex items-center justify-between">
            <div className="ml-6 herder-info">
                <h1 className="text-3xl font-bold">Board: {board.title}</h1>
                <p className="text-gray-500">Descrição: {board.description}</p>
            </div>
            <div className="mr-6">
            <DropdownMenu>
                <DropdownMenuTrigger  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md text-gray-500 hover:bg-gray-300 transition">
                    <Button>
                        <EllipsisVertical className="h-6 w-6"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md p-2 z-50">
                <DropdownMenuItem className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                    <Pencil />  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-1 text-sm text-sm hover:bg-gray-100 cursor-pointer" 
                onClick={() => setShowModal(true)}
                >
                    <Plus /> Adicionar Tarefa
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </div>
        {showModal && (
        <TaskModal
            lanes={board.lanes}
            tasks={tasks}
            open={showModal}
            onClose={() => setShowModal(false)}
            onSave={onAddTask}
        />
        )}
       
        </>
    )
}