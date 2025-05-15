"use client"

import { useEffect, useState, useCallback } from "react"
import { ClipboardList, AlignLeft, Users, PlusCircle, Save, Tag } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Task, User } from "@/lib/types"
import { getUsers } from "@/api/usersService"
import { useTaskStore } from "@/store/useTaskStore"
import { taskFormSchema } from "@/schemas/taskSchema"
import { toast } from "react-toastify"
import { useBoardStore } from "@/store/useBoardStore"
import { useParams } from "react-router-dom"
import { useTaskActions } from "@/hooks/actions/useTaskActions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/custom-modal/Modal"
import { UserMultiSelect } from "../basic-components/UserMultiSelect"
import { CustomSelect } from "../basic-components/CustomSelect"

type TaskModalProps = {
  open: boolean
  isEditing: string
  onClose: () => void
}

const TaskModal = ({ open, onClose, isEditing }: TaskModalProps) => {
  const [titleTask, setTitleTask] = useState("")
  const [descriptionTask, setDescriptionTask] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const tasks = useTaskStore((state) => state.tasks)
  const task = useTaskStore((state) => state.task)
  const { board } = useBoardStore()
  const { id: boardId } = useParams<{ id: string }>()
  const { handleAddTask, handleUpdateTask, handleGetTaskById } = useTaskActions(boardId!)

  // Memoize the getLastOrderInLane function to prevent unnecessary recalculations
  const getLastOrderInLane = useCallback((laneId: string, tasksList: Task[]): number => {
    const laneTasks = tasksList.filter((task) => task.laneId === laneId)
    if (laneTasks.length === 0) return 0

    const maxOrder = Math.max(...laneTasks.map((task) => task.order ?? 0))
    return maxOrder + 1
  }, [])

  const handleSubmit = async () => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    if (!titleTask) {
      toast.warning("Título é obrigatório!")
      setIsSubmitting(false)
      return
    }

    if (!selectedStatus) {
      toast.warning("Status é obrigatório!")
      setIsSubmitting(false)
      return
    }

    try {
      if (!boardId) {
        toast.error("ID do board não encontrado")
        setIsSubmitting(false)
        return
      }

      const order = getLastOrderInLane(selectedStatus, tasks)
      const uniqueMembers = [...new Set(selectedMembers.map((u) => u._id))]
      const taskData = {
        title: titleTask,
        description: descriptionTask,
        laneId: selectedStatus,
        members: uniqueMembers,
        order,
        boardId,
      }

      const result = taskFormSchema.safeParse(taskData)
      if (!result.success) {
        console.error("Erro ao validar tarefa:", result.error)
        toast.error("Erro ao validar tarefa!")
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        await handleUpdateTask(isEditing, result.data, boardId)
        toast.success("Tarefa atualizada com sucesso!")
      } else {
        await handleAddTask(result.data, boardId)
        toast.success("Tarefa criada com sucesso!")
      }

      // Reset form and close modal
      resetForm()
      onClose()
    } catch (error) {
      console.error("Erro ao criar/atualizar tarefa:", error)
      toast.error("Erro ao salvar tarefa. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitleTask("")
    setDescriptionTask("")
    setSelectedStatus("")
    setSelectedMembers([])
    setIsSubmitting(false)
    setActiveTab("details")
  }

  // Fetch users only when modal is opened
  useEffect(() => {
    let isMounted = true

    if (open) {
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
    }

    return () => {
      isMounted = false
    }
  }, [open])

  // Fetch task data when editing
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let isMounted = true

    if (isEditing && open) {
      handleGetTaskById(isEditing)
    }

    return () => {
      isMounted = false
    }
  }, [isEditing, open, handleGetTaskById])

  // Set form data when task is loaded
  useEffect(() => {
    if (task && isEditing && open) {
      setTitleTask(task.title || "")
      setDescriptionTask(task.description || "")
      setSelectedStatus(task.laneId || "")
      setSelectedMembers(task.members || [])
    } else if (!isEditing && open) {
      // Set default lane if available and not editing
      if (board?.lanes && board.lanes.length > 0) {
        setSelectedStatus(board.lanes[0].id)
      }
    }
  }, [task, isEditing, open, board?.lanes])

  // Determine the color of status based on lane name
  const getStatusColor = useCallback(
    (laneId: string) => {
      if (!board?.lanes) return "bg-slate-500"

      const lane = board.lanes.find((lane) => lane.id === laneId)
      if (!lane) return "bg-slate-500"

      const laneTitle = lane.title.toLowerCase()
      if (laneTitle.includes("todo") || laneTitle.includes("fazer")) return "bg-slate-500"
      if (laneTitle.includes("progress") || laneTitle.includes("andamento")) return "bg-amber-500"
      if (laneTitle.includes("done") || laneTitle.includes("concluído")) return "bg-emerald-500"
      return "bg-slate-500"
    },
    [board?.lanes],
  )

  // Handle modal close with cleanup
  const handleModalClose = () => {
    if (isSubmitting) return // Prevent closing while submitting
    resetForm()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      className="w-full max-w-lg p-0 overflow-visible z-[100] rounded-xl bg-white shadow-xl"
      preventClose={isSubmitting}
    >
      {/* Header color strip */}
      <div className={`h-2 ${selectedStatus ? getStatusColor(selectedStatus) : "bg-emerald-500"}`} />

      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            {isEditing ? (
              <ClipboardList className="h-5 w-5 text-emerald-600" />
            ) : (
              <PlusCircle className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div>
            <ModalTitle className="text-xl font-semibold text-slate-800">
              {isEditing ? "Editar Tarefa" : "Criar Nova Tarefa"}
            </ModalTitle>
            <ModalDescription className="text-sm text-slate-500 mt-1">
              {isEditing
                ? "Atualize os detalhes da tarefa conforme necessário"
                : "Preencha os detalhes para criar uma nova tarefa"}
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" /> Detalhes
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Membros
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="p-6 pt-4 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="task-name" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-slate-500" />
                Título <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="task-name"
                type="text"
                placeholder="Digite o título da tarefa..."
                value={titleTask}
                onChange={(e) => setTitleTask(e.target.value)}
                className="border border-slate-200 rounded-lg p-2.5 w-full focus-visible:ring-emerald-500"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="task-description"
                className="text-sm font-medium text-slate-700 flex items-center gap-1.5"
              >
                <AlignLeft className="h-4 w-4 text-slate-500" />
                Descrição
              </Label>
              <Textarea
                className="border border-slate-200 rounded-lg p-2.5 w-full min-h-[100px] focus-visible:ring-emerald-500"
                id="task-description"
                placeholder="Descreva os detalhes da tarefa..."
                value={descriptionTask}
                onChange={(e) => setDescriptionTask(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <CustomSelect board={board||null} selectedStatus={selectedStatus} setSelectedStatus={selectedStatus => setSelectedStatus(selectedStatus) } getStatusColor={getStatusColor}/>
              {(!board?.lanes || board.lanes.length === 0) && (
                <p className="text-sm text-amber-500">Nenhum status disponível. Crie colunas no board primeiro.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="members" className="p-6 pt-4 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-slate-500" />
                Membros Responsáveis
              </Label>
              <UserMultiSelect
                users={users}
                selected={selectedMembers}
                onChange={(users) => setSelectedMembers(users)}
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
          </TabsContent>
        </Tabs>
      </div>

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
                <PlusCircle className="h-4 w-4" /> Criar Tarefa
              </>
            )}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default TaskModal
