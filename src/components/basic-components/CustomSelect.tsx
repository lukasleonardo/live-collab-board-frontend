import { useState, useRef, useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { Board } from "@/lib/types"

export interface CustomSelectProps {
  board: Board|null
  selectedStatus: string
  setSelectedStatus: (value: string) => void
  getStatusColor: (id: string) => string
}


export const CustomSelect=({ board, selectedStatus, setSelectedStatus, getStatusColor }:CustomSelectProps) =>{
  const [open, setOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement  | null>(null)

  useEffect(() => {
    function handleClickOutside(event:any) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedLane = board?.lanes.find((l) => l.id === selectedStatus)

  return (
    <div ref={selectRef} className="relative">
      <label htmlFor="task-status" className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
        <CheckCircle2 className="h-4 w-4 text-slate-500" />
        Status <span className="text-rose-500">*</span>
      </label>
      <button
        id="task-status"
        type="button"
        className="w-full border border-slate-200 rounded-lg p-2.5 focus-visible:ring-emerald-500 flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          {selectedLane ? (
            <>
              <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedLane.id)}`} />
              {selectedLane.title}
            </>
          ) : (
            <span className="text-slate-400">Selecione o status</span>
          )}
        </span>
        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 7l3-3 3 3M7 13l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-md max-h-60 overflow-auto">
          {board?.lanes.map((lane) => (
            <li
              key={lane.id}
              onClick={() => {
                setSelectedStatus(lane.id)
                setOpen(false)
              }}
              className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
            >
              <div className={`h-2 w-2 rounded-full ${getStatusColor(lane.id)}`} />
              {lane.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
