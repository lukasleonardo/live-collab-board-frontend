
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { UserMultiSelect } from "../UserMultiSelect"
import { getUsers } from "@/api/usersService"
import { User } from "@/lib/types"
import { Label } from "../ui/label"
import { boardFormSchema } from "@/schemas/boardSchema"
import { toast } from "react-toastify"
import { useBoardStore } from "@/hooks/useBoardStore"


type BoardModalProps={
  open: boolean
  onClose: () => void
}

export const BoardModal = ({open, onClose}:BoardModalProps) => {
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

    const {handleCreateBoard} = useBoardStore();

    useEffect(() => {
      if(!open) return
      const fetchMembers = async () => {
        try {
          const data = await getUsers();
          setUsers(data);
        } catch (error) {
          console.log('Erro ao buscar membros', error);
        }
      };
  
      fetchMembers();
    },[open])
    
    const handleSubmit = async () => {
      const userIds = selectedMembers.map((member) => member._id);
      const boardData = {
        title: newBoardName,
        description: newBoardDescription,
        members: userIds
      }

      const result = boardFormSchema.safeParse(boardData);
      if (!result.success) {
        console.error("Erro ao validar quadro:", result.error);
        toast.error("Erro ao validar quadro!");
        return;
      }


      handleCreateBoard(result.data)
      setNewBoardName('');setNewBoardDescription('')
      onClose();
    }

    return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg p-6 rounded-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Criar Novo Quadro</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="board-name" className="text-white-700 font-medium">Nome do Quadro</Label>
          <Input 
            id="board-name" 
            type="text" 
            placeholder="Digite o nome do quadro..." 
            value={newBoardName} 
            onChange={(e) => setNewBoardName(e.target.value)}
            className="border border-gray-300 mt-2 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
          />
          <Label htmlFor="board-description" className="text-white-700 font-medium">Descrição:</Label>
          <Textarea  className="border border-gray-300 mt-2 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500" 
            id="board-description" placeholder="Descreva o board..." 
            value={newBoardDescription}  onChange={(e)=>setNewBoardDescription(e.target.value)}/>

            <Label className="text-white-700 font-medium">Membros:</Label>
            <UserMultiSelect users={users} selected={selectedMembers} onChange={setSelectedMembers}/>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
          >
            Criar
          </Button>
          <Button 
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    )
}