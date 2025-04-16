"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTaskStore } from "@/hooks/useTaskStore"

interface SearchBarProps {
  placeholder?: string
  className?: string
  delay?: number
}

export function SearchBar({ placeholder = "Pesquisar...", className, delay = 300 }: SearchBarProps) {
  const query = useTaskStore((state) => state.query)
  const setQuery = useTaskStore((state) => state.setQuery)

  const [inputValue, setInputValue] = useState(query)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(inputValue)
      
    }, delay)

    return () => clearTimeout(timeout)
  }, [inputValue, delay, setQuery])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setQuery(inputValue)
    }
  }

  const handleChange=(value:string)=>{
    setQuery(value)
    setInputValue(value)
  }
  const clearSearch = () => {
    setInputValue("")
    setQuery("")
  }

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-full transition-all duration-300",
        isFocused ? "ring-2 ring-primary/20" : "",
        className,
      )}
    >
      <div className="relative flex items-center w-full rounded-full border border-input bg-background px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md">
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors duration-200",
            isFocused || inputValue ? "text-primary" : "text-muted-foreground",
          )}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        {inputValue && (
          <button onClick={clearSearch} className="group rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
