
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
import { useBoardStore } from "@/store/useBoardStore"
import {  useBoardActions } from "@/hooks/actions/useBoardActions"



type BoardModalProps={
  open: boolean
  isEditing: string
  onClose: () => void
}

export const BoardModal = ({isEditing,open, onClose}:BoardModalProps) => {
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const {  
      createBoardHandler,
      updateBoardHandler,
    } = useBoardActions();
    const {board} = useBoardStore();

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

    useEffect(() => {
      if (!board || !isEditing || !open) return;
      setNewBoardName(board.title);
      setNewBoardDescription(board.description);
      setSelectedMembers(
        board.members.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m._id === member._id)
        )
      );
      
    }, [board, isEditing, open]);
    
    
    const handleSubmit = async () => {
      const userIds = [...new Set(selectedMembers.map((u) => u._id))];
      const boardData = {
        title: newBoardName,
        description: newBoardDescription,
        members: userIds,
      };
    
      const result = boardFormSchema.safeParse(boardData);
      if (!result.success) {
        console.error("Erro ao validar quadro:", result.error);
        toast.error("Erro ao validar quadro!");
        return;
      }
    
      try {
        if (isEditing) {
          await updateBoardHandler(isEditing, result.data);
          toast.success("Quadro atualizado com sucesso!");
        } else {
          await createBoardHandler(result.data);
          toast.success("Quadro criado com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao salvar quadro:", error);
        toast.error("Erro ao salvar quadro!");
      }
    
      // Resetar form
      setNewBoardName('');
      setNewBoardDescription('');
      setSelectedMembers([]);
      onClose();
    };
    

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
            {isEditing ? 'Atualizar' : 'Criar'}
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