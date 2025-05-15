"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreHorizontal, Calendar, Users, Pencil, Trash2, GripVertical } from "lucide-react"
import type { Task } from "@/lib/types"
import TaskModal from "./TaskModal"
import { useTaskActions } from "@/hooks/actions/useTaskActions"
import { useBoardStore } from "@/store/useBoardStore"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface TaskCardProps {
  task: Task
  isEditing?: boolean
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState("")
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id })
  const currentBoardId = useBoardStore((state) => state.currentBoardId)
  const { handleDeleteTask } = useTaskActions(currentBoardId!)
  const board = useBoardStore((state) => state.board)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEdit = () => {
    setShowModal(true)
    setIsEditing(task._id)
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // If less than 7 days ago, show relative time
    if (diffDays < 7) {
      if (diffDays === 0) {
        return "Hoje"
      } else if (diffDays === 1) {
        return "Ontem"
      } else {
        return `${diffDays} dias atrás`
      }
    } else {
      // Otherwise show formatted date
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    }
  }

  // Get lane color based on lane ID
  const getLaneColor = (laneId: string) => {
    const lane = board?.lanes.find((lane) => lane.id === laneId)
    if (!lane) return "bg-slate-500"

    const laneTitle = lane.title.toLowerCase()
    if (laneTitle.includes("todo") || laneTitle.includes("fazer")) return "bg-red-400"
    if (laneTitle.includes("progress") || laneTitle.includes("andamento")) return "bg-amber-500"
    if (laneTitle.includes("done") || laneTitle.includes("concluído")) return "bg-emerald-500"
    return "bg-slate-500"
  }

  // Truncate description for preview
  const truncateDescription = (text: string, maxLength = 80) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 ${
          isDragging ? "rotate-1 scale-105 shadow-lg z-50" : ""
        }`}
      >
        {/* Color indicator based on lane */}
        <div className={`h-1.5 w-full rounded-t-lg ${getLaneColor(task.laneId)}`} />

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>

        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-medium text-slate-800 line-clamp-2 pr-6">{task.title}</h3>

          {/* Description preview (if exists) */}
          {task.description && (
            <p className="mt-2 text-sm text-slate-500 line-clamp-2">{truncateDescription(task.description)}</p>
          )}

          {/* Metadata */}
          <div className="mt-4 flex flex-col gap-2">
            {/* Date */}
            <div className="flex items-center text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <span>{formatDate(task.updatedAt)}</span>
            </div>

            {/* Members */}
            {task.members && task.members.length > 0 && (
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                <div className="flex -space-x-2">
                  {task.members.slice(0, 3).map((member, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-600">
                              {typeof member === "string"
                                ? "U"
                                : member.name
                                  ? member.name.substring(0, 2).toUpperCase()
                                  : "U"}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          {typeof member === "string" ? "Usuário" : member.name || "Usuário"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {task.members.length > 3 && (
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                        +{task.members.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="absolute bottom-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleEdit()}>
                  <Pencil className="h-4 w-4" />
                  <span>Editar tarefa</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-500 cursor-pointer focus:text-red-500"
                  onClick={() => handleDeleteTask(task._id, currentBoardId!)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir tarefa</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {showModal && <TaskModal open={showModal} onClose={() => setShowModal(false)} isEditing={isEditing} />}
    </>
  )
}
