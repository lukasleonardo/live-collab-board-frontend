
import type { Board } from "@/lib/types"
import { BoardCard } from "@/components/listBoardPage/BoardCard"
import { Plus } from "lucide-react"

type BoardGridViewProps = {
  boards: Board[]
  onCreateBoard: () => void
}

export const BoardGridView = ({ boards, onCreateBoard }: BoardGridViewProps) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <BoardCard key={board._id} board={board} length={boards.length} />
      ))}
      {/* Create new board card */}
      <div
        onClick={onCreateBoard}
        className="border-2 border-dashed border-slate-300 bg-white/50 rounded-xl p-6 flex flex-col items-center justify-center h-[220px] text-center cursor-pointer hover:bg-white hover:border-emerald-300 transition-colors"
      >
        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
          <Plus className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-1">Criar novo board</h3>
        <p className="text-sm text-slate-500">Clique para adicionar um novo quadro</p>
      </div>
    </div>
  )
}
