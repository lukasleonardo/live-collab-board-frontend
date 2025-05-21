import type React from "react"

import {  useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Clock, Kanban, Star, StarOff, Trash2, Users, MoreVertical } from "lucide-react"
import type { Board } from "@/lib/types"
import { useBoardActions } from "@/hooks/actions/useBoardActions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"

type BoardCardProps = {
  board: Board
  length?: number
  onToggleFavorite?: (boardId: string) => void
}

export const BoardCard = ({ board, onToggleFavorite }: BoardCardProps) => {
  const navigate = useNavigate()
  const { deleteBoardHandler } = useBoardActions()
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

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

  const handleCardClick = () => {
    navigate(`/dashboard/${board._id}`, { state: { board } })
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteAlert(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteBoardHandler(board._id)
    } catch (error) {
      console.error("Erro ao deletar board:", error)
    }
    setShowDeleteAlert(false)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(board._id)
    }
  }

  useEffect(() => {
  if (!showDeleteAlert) {
    document.body.style.pointerEvents = 'auto'
  }
}, [showDeleteAlert])


  // Determine if the board is a favorite (this should be based on your actual data)
  const isFavorite = true 

  return (
    <>
      <Card
        onClick={handleCardClick}
        className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
      >
        {/* Color indicator at top */}
        <div className="h-2 bg-emerald-500" />

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="font-semibold text-slate-800 line-clamp-1">{board.title}</CardTitle>
                <button
                  onClick={handleToggleFavorite}
                  className="text-amber-400 hover:text-amber-500 focus:outline-none"
                  aria-label={board.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  {board.isFavorite ? (
                    <Star className="h-4 w-4 fill-amber-400" />
                  ) : (
                    <StarOff className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2">{board.description}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white" >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/dashboard/${board._id}`, { state: { board } })
                  }}
                >
                  <Kanban className="h-4 w-4 mr-2" />
                  <span>Abrir board</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  {isFavorite ? (
                    <>
                      <StarOff className="h-4 w-4 mr-2" />
                      <span>Remover dos favoritos</span>
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      <span>Adicionar aos favoritos</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500 focus:text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Excluir board</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <Badge variant="outline" className="bg-slate-50 text-slate-600 gap-1 flex items-center">
              <Kanban className="h-3 w-3" /> {board.taskCount} tarefas
            </Badge>

            {board.members && board.members.length > 0 && (
              <Badge variant="outline" className="bg-slate-50 text-slate-600 gap-1 flex items-center">
                <Users className="h-3 w-3" /> {board.members.length} membros
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-slate-100 mt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                {board.owner?.name?.substring(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-slate-500">{board.owner?.name || "Usuário"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500">{formatDate(board.updatedAt)}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteAlert && <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-white" onOpenAutoFocus={(e) => {
      e.preventDefault(); // impede que o foco automático trave a UI
    }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Board</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o board "{board.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}
    </>
  )
}
