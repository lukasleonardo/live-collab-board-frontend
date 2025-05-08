import { Task } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import TaskModal from './TaskModal';
import { useTaskActions } from '@/hooks/actions/useTaskActions';
import { useBoardStore } from '@/store/useBoardStore';

interface TaskCardProps {
  task: Task;
  isEditing?: boolean
}

export const TaskCard = ({ task}:TaskCardProps)=> {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState('');
    const formattedDate = new Date(task.updatedAt).toLocaleDateString('pt-BR');
    const {attributes, listeners,setNodeRef,transform,transition, isDragging} = useSortable({id:task._id});
    const currentBoardId = useBoardStore(state => state.currentBoardId);
    const {handleDeleteTask} = useTaskActions(currentBoardId!);
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0 : 1,
    };
    const handleEdit = () =>{ 
      setShowModal(true)
      setIsEditing(task._id)
    };



    return(
      <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="relative flex flex-col bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Título */}
        <span className="text-lg font-semibold text-gray-900 truncate">
          {task.title}
        </span>    
        {/* Data e botão */}
        <div className="flex items-center justify-between mt-2">
          {/* Data */}
          <span className="text-sm text-gray-600">Data: {formattedDate}</span>
      
          {/* Botão Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md text-gray-500 hover:bg-gray-300 transition">
              &#8230;
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md p-2 z-50">
              <DropdownMenuItem className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer" 
                onClick={() => handleEdit()}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-1 text-sm text-red-500 hover:bg-gray-100 cursor-pointer" 
                onClick={()=>handleDeleteTask(task._id,currentBoardId!)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {showModal && (
        <TaskModal
            open={showModal}
            onClose={() => setShowModal(false)} 
            isEditing={isEditing}/>
        )}
      </div>
      
    )
}
