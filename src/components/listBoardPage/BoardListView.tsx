
import type { Board } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Users, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

type BoardListViewProps = {
  boards: Board[]
}

export const BoardListView = ({ boards }: BoardListViewProps) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      {boards.map((board) => (
        <div
          key={board._id}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <div>
              <h3 className="font-medium text-slate-800">{board.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-1">{board.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end text-sm">
              <div className="flex items-center gap-1 text-slate-500">
                <Users className="h-3.5 w-3.5" />
                <span>{board.members?.length || 0} membros</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {new Date(board.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200"
              onClick={() => navigate(`/dashboard/${board._id}`,{state:{board}})} 
            >
              Abrir
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
