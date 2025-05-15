"use client"

import { useEffect, useState } from "react"
import { useBoardStore } from "@/store/useBoardStore"
import { useBoardActions } from "@/hooks/actions/useBoardActions"
import { useSocketContext } from "@/hooks/socket/SocketContext"
import { useBoardSocketListeners } from "@/hooks/socket/useBoardSocketListeners"
import { BoardModal } from "@/components/listBoardPage/BoardModal"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { BoardGridView } from "@/components/listBoardPage/BoardGridView"
import { BoardListView } from "@/components/listBoardPage/BoardListView"
import { BoardsSearch } from "@/components/listBoardPage/BoardSearch"
import { BoardsHeader } from "@/components/listBoardPage/BoardsHeader"
import { BoardsViewToggle } from "@/components/listBoardPage/BoardViewToggle"
import { EmptyBoardsState } from "@/components/listBoardPage/EmptyBoardState"


type SortOption = "recent" | "oldest" | "alphabetical" | "reverseAlphabetical"
type ViewMode = "grid" | "list"

const ListDashboards = () => {
  const socket = useSocketContext()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const boards = useBoardStore((state) => state.boards)
  const { fetchBoards } = useBoardActions()
  useBoardSocketListeners(socket)

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  // Filter boards based on search term
  const filteredBoards = boards.filter(
    (board) =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort boards based on selected option
  const sortedBoards = [...filteredBoards].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "oldest":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "reverseAlphabetical":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const handleCreateBoard = () => {
    setShowModal(true)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <BoardsHeader onCreateBoard={handleCreateBoard} />
          <BoardsSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </header>

        {/* View options */}
        <BoardsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} totalBoards={filteredBoards.length} />

        {/* Board Modal */}
        <BoardModal open={showModal} isEditing="" onClose={() => setShowModal(false)} />

        {/* Content */}
        {boards.length === 0 || filteredBoards.length === 0 ? (
          <EmptyBoardsState
            isSearching={boards.length > 0 && filteredBoards.length === 0}
            searchTerm={searchTerm}
            onCreateBoard={handleCreateBoard}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsContent value="grid">
              <BoardGridView boards={sortedBoards} onCreateBoard={handleCreateBoard} />
            </TabsContent>
            <TabsContent value="list">
              <BoardListView boards={sortedBoards} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default ListDashboards
