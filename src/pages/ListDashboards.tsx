import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { BoardCard } from "@/components/BoardCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";

const ListDashboards = ()=>{
    const [boards, setBoards] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');

    useEffect(()=>{
        const fetchBoards = async ()=>{
            const response = await api.get('/boards')
            console.log(response.data)
            setBoards(response.data)
        }
        fetchBoards()
    },[])

    const handleCreateBoard = async ()=>{
        if(!newBoardName)return
        try{
            const response = await api.post('/boards', {title:newBoardName,description:newBoardDescription})
            setBoards([...boards,response.data])
            setNewBoardName('')
            setNewBoardDescription('')
            setShowModal(false)
        }catch(error){
            console.log('Erro ao criar board',error)
        }
    }

   const handleDelete = async (id:string)=>{
    try{
        await api.delete(`/boards/${id}`)
        setBoards((prevBoards) => prevBoards.filter((board:any) => board._id !== id));
    }catch(error){
        console.log('Erro ao deletar board',error)
    }
   }
  

    return( 

  <div className="max-w-8xl mx-auto mt-8 mx-2 bg-white p-8 rounded-lg shadow-lg">
    
    {/* Título */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Meus Boards</h1>
      <Button 
        onClick={() => setShowModal(true)} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md"
      >
        + Novo Quadro
      </Button>
    </div>

    {/* Modal */}
    <Dialog open={showModal} onOpenChange={setShowModal}>
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
          <Button 
            onClick={handleCreateBoard} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
          >
            Criar
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Lista de Boards */}
      {boards.length === 0 && <p className="text-gray-600 mt-4">Voce ainda nao possui nenhum quadro criado.</p>}
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {boards.map((board) => (
        <BoardCard 
          key={board._id}
          id={board._id} 
          name={board.title} 
          description={board.description} 
          owner={board.owner.name} 
          lastUpdate={board.updatedAt}
          onDelete={handleDelete} 
        />
      ))}
    </div>

  </div>


      )
}

export default ListDashboards