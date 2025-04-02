import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"


const TaskCard =  ({ task, onDelete }: { task: { id: string; title: string, date: string }; onDelete: (id: string) => Promise<void> }) => {

    return(
        <div className="relative flex flex-col bg-white shadow-md rounded-lg p-3 w-full max-w-xs">
        {/* Título */}
        <span className="text-lg font-semibold text-gray-900 truncate">
          {task.title}
        </span>    
        {/* Data e botão */}
        <div className="flex items-center justify-between mt-2">
          {/* Data */}
          <span className="text-sm text-gray-600">Data: {task.date}</span>
      
          {/* Botão Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md text-gray-500 hover:bg-gray-300 transition">
              &#8230;
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md p-2">
              <DropdownMenuItem className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-1 text-sm text-red-500 hover:bg-gray-100 cursor-pointer" 
                onClick={()=>onDelete(task.id)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
    )
}

export default TaskCard