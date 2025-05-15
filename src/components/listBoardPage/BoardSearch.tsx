
import { Input } from "@/components/ui/input"
import { Search, SortAsc } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortOption = "recent" | "oldest" | "alphabetical" | "reverseAlphabetical"

type BoardsSearchProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
}

export const BoardsSearch = ({ searchTerm, onSearchChange, sortBy, onSortChange }: BoardsSearchProps) => {
  return (
    <div className="mt-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Pesquisar boards..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
        />
      </div>
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px] bg-white border-slate-200">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Ordenar por" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Ordenar por</SelectLabel>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
              <SelectItem value="alphabetical">Alfabética (A-Z)</SelectItem>
              <SelectItem value="reverseAlphabetical">Alfabética (Z-A)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
