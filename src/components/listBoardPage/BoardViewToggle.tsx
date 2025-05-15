
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List } from "lucide-react"

type ViewMode = "grid" | "list"

type BoardsViewToggleProps = {
  viewMode: ViewMode
  onViewModeChange: (value: ViewMode) => void
  totalBoards: number
}

export const BoardsViewToggle = ({ viewMode, onViewModeChange, totalBoards }: BoardsViewToggleProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as ViewMode)} className="w-auto">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="grid" className="data-[state=active]:bg-slate-100 gap-1.5">
            <LayoutGrid className="h-4 w-4" /> Grid
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-slate-100 gap-1.5">
            <List className="h-4 w-4" /> Lista
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="text-sm text-slate-500">
        {totalBoards} {totalBoards === 1 ? "board encontrado" : "boards encontrados"}
      </div>
    </div>
  )
}
