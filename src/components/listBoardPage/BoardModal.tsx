"use client"

import { useState, useEffect, useCallback } from "react"
import { PlusCircle, Users, Layout, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { getUsers } from "@/api/usersService"
import type { User } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { boardFormSchema } from "@/schemas/boardSchema"
import { toast } from "react-toastify"
import { useBoardStore } from "@/store/useBoardStore"
import { useBoardActions } from "@/hooks/actions/useBoardActions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from "@/components/ui/custom-modal/Modal"
import { UserMultiSelect } from "../basic-components/UserMultiSelect"

type BoardModalProps = {
  open: boolean
  isEditing: string
  onClose: () => void
}

export const BoardModal = ({ isEditing, open, onClose }: BoardModalProps) => {
  const [newBoardName, setNewBoardName] = useState("")
  const [newBoardDescription, setNewBoardDescription] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createBoardHandler, updateBoardHandler } = useBoardActions()
  const { board } = useBoardStore()

  // Fetch users only when modal is opened
  useEffect(() => {
    let isMounted = true

    if (!open) return

    const fetchMembers = async () => {
      try {
        const data = await getUsers()
        if (isMounted) {
          setUsers(data)
        }
      } catch (error) {
        console.log("Erro ao buscar membros", error)
        if (isMounted) {
          toast.error("Não foi possível carregar os usuários")
        }
      }
    }

    fetchMembers()

    return () => {
      isMounted = false
    }
  }, [open])

  // Set form data when board is loaded for editing
  useEffect(() => {
    if (!board || !isEditing || !open || users.length === 0) return

    setNewBoardName(board.title || "")
    setNewBoardDescription(board.description || "")

    // Find selected members from users array
    const selected = users.filter((user) =>
      board.members.some((member) => {
        const memberId = typeof member === "string" ? member : member._id
        return user._id === memberId
      }),
    )

    setSelectedMembers(selected)
  }, [board, isEditing, open, users])

  const handleSubmit = async () => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    try {
      const userIds = [
        ...new Set(selectedMembers.map((u) => u?._id).filter((id): id is string => typeof id === "string")),
      ]

      const boardData = {
        title: newBoardName,
        description: newBoardDescription,
        members: userIds,
      }

      const result = boardFormSchema.safeParse(boardData)
      if (!result.success) {
        console.error("Erro ao validar quadro:", result.error)
        toast.error("Por favor, preencha todos os campos obrigatórios")
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        await updateBoardHandler(isEditing, result.data)
        toast.success("Quadro atualizado com sucesso!")
      } else {
        await createBoardHandler(result.data)
        toast.success("Quadro criado com sucesso!")
      }

      // Reset form and close modal
      resetForm()
      onClose()
    } catch (error) {
      console.error("Erro ao salvar quadro:", error)
      toast.error("Erro ao salvar quadro. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  const resetForm = useCallback(() => {
    setNewBoardName("")
    setNewBoardDescription("")
    setSelectedMembers([])
    setIsSubmitting(false)
  }, [])

  // Handle modal close with cleanup
  const handleModalClose = useCallback(() => {
    if (isSubmitting) return // Prevent closing while submitting
    resetForm()
    onClose()
  }, [resetForm, onClose, isSubmitting])

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      className="w-full max-w-lg p-0 overflow-hidden rounded-xl bg-white shadow-xl"
      preventClose={isSubmitting}
    >
      <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600" />

      <ModalHeader className="px-6 pt-6 pb-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            {isEditing ? (
              <Edit className="h-5 w-5 text-emerald-600" />
            ) : (
              <PlusCircle className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div>
            <ModalTitle className="text-xl font-semibold text-slate-800">
              {isEditing ? "Editar Quadro" : "Criar Novo Quadro"}
            </ModalTitle>
            <p className="text-sm text-slate-500 mt-2">
              {isEditing
                ? "Atualize as informações do seu quadro"
                : "Preencha as informações para criar um novo quadro"}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="board-name" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Layout className="h-4 w-4 text-slate-500" />
            Nome do Quadro <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="board-name"
            type="text"
            placeholder="Digite o nome do quadro..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="border border-slate-200 rounded-lg p-2.5 w-full focus-visible:ring-emerald-500"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="board-description" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Layout className="h-4 w-4 text-slate-500" />
            Descrição
          </Label>
          <Textarea
            className="border border-slate-200 rounded-lg p-2.5 w-full min-h-[100px] focus-visible:ring-emerald-500"
            id="board-description"
            placeholder="Descreva o propósito deste quadro..."
            value={newBoardDescription}
            onChange={(e) => setNewBoardDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-500" />
            Membros
          </Label>
          <UserMultiSelect
            users={users}
            selected={selectedMembers}
            onChange={setSelectedMembers}

          />

          {selectedMembers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <Badge
                  key={member._id}
                  variant="outline"
                  className="bg-slate-50 text-slate-700 hover:bg-slate-100 gap-1.5 py-1 px-2"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                      {member.name?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {member.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={handleModalClose}
            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processando...
              </span>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4" /> Salvar Alterações
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" /> Criar Quadro
              </>
            )}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
