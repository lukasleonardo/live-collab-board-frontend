// components/UserMultiSelect.tsx
import { User } from "@/lib/types"
import { useState } from "react"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"


type UserMultiSelectProps = {
  users: User[]
  selected: User[]
  onChange: (selected: User[]) => void
  placeholder?: string
}

export const UserMultiSelect = ({ users, selected, onChange, placeholder }: UserMultiSelectProps) => {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())) &&
      !selected.find((sel) => sel._id === user._id)
  )

  const addUser = (user: User) => {
    onChange([...selected, user])
    setSearch("")
  }

  const removeUser = (id: string) => {
    onChange(selected.filter((user) => user._id !== id))
  }

  return (
    <div className="space-y-2">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder || "Buscar usuário..."}
      />

      {search.length > 0 && filteredUsers.length > 0 && (
        <div className="border rounded p-2 max-h-40 overflow-y-auto bg-white shadow">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="p-1 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => addUser(user)}
            >
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 text-sm text-gray-500">({user.email})</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((user) => user && user._id ?(
          <Badge key={user._id} variant="secondary" className="flex items-center gap-2">
            {user.name}
            <button onClick={() => removeUser(user._id)} className="text-red-500 hover:text-red-700 ml-1">x</button>
          </Badge>
        ):null)}
      </div>
    </div>
    )
}



