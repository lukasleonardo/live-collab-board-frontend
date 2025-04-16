import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BoardCard } from "@/components/listBoardPage/BoardCard";
import { BoardModal } from "@/components/listBoardPage/BoardModal";
import { useBoardStore } from "@/hooks/useBoardStore";

const ListDashboards = ()=>{
    const [showModal, setShowModal] = useState(false)
    const {boards, fetchBoards} = useBoardStore()


   useEffect(() => {
      fetchBoards()
   },[fetchBoards])



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
      <BoardModal open={showModal}  onClose={()=>setShowModal(false)}/>    
      {/* Lista de Boards */}
      {boards.length === 0 && <p className="text-gray-600 mt-4">Voce ainda nao possui nenhum quadro criado.</p>}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <BoardCard 
            key={board._id}
            board={board}   
          />
        ))}
      </div>
    </div>
    )
}

export default ListDashboards