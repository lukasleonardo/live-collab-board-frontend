
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { UserMultiSelect } from "../UserMultiSelect"
import { getUsers } from "@/api/usersService"
import { User } from "@/lib/types"
import { Label } from "../ui/label"


type BoardModalProps={
  onCreateBoard:  (name: string, description: string, members: string[]) => Promise<void> 
  open: boolean
  onClose: () => void
}

export const BoardModal = ({open,onCreateBoard, onClose}:BoardModalProps) => {
    //const [showModal, setShowModal] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

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
      onCreateBoard(newBoardName, newBoardDescription,userIds)
      setNewBoardName('');setNewBoardDescription('')
      onClose();
    }

    return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg p-6 rounded-lg">
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