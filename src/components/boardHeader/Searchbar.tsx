"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function SearchBar({ placeholder = "Pesquisar...", onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-md transition-all duration-300",
        isFocused ? "ring-2 ring-primary/20" : "",
        className,
      )}
    >
      <div className="relative flex items-center w-full rounded-full border border-input bg-background px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md">
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors duration-200",
            isFocused || query ? "text-primary" : "text-muted-foreground",
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={clearSearch} className="group rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
