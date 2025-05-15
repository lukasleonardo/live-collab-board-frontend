
import { Button } from "@/components/ui/button"
import { FolderKanban, Plus, Search } from "lucide-react"

type EmptyBoardsStateProps = {
  isSearching: boolean
  searchTerm: string
  onCreateBoard: () => void
  onClearSearch: () => void
}

export const EmptyBoardsState = ({ isSearching, searchTerm, onCreateBoard, onClearSearch }: EmptyBoardsStateProps) => {
  if (isSearching) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Nenhum resultado encontrado</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Não encontramos nenhum board que corresponda à sua pesquisa "{searchTerm}".
        </p>
        <Button variant="outline" onClick={onClearSearch} className="border-slate-200 text-slate-700">
          Limpar pesquisa
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
        <FolderKanban className="h-8 w-8 text-emerald-500" />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Nenhum board encontrado</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        Você ainda não possui nenhum quadro criado. Comece criando seu primeiro board para organizar suas tarefas.
      </p>
      <Button onClick={onCreateBoard} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5">
        <Plus className="h-4 w-4" /> Criar meu primeiro board
      </Button>
    </div>
  )
}
