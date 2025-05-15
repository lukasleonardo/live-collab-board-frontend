
import { Button } from "@/components/ui/button"
import { Kanban, Plus } from "lucide-react"

type BoardsHeaderProps = {
  onCreateBoard: () => void
}

export const BoardsHeader = ({ onCreateBoard }: BoardsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Kanban className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Boards</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gerencie e organize seus projetos em um só lugar</p>
        </div>
      </div>
      <Button onClick={onCreateBoard} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5">
        <Plus className="h-4 w-4" /> Novo Quadro
      </Button>
    </div>
  )
}
