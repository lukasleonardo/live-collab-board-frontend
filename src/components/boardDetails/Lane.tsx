// components/Board/Lane.tsx
import { Task } from "@/lib/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { Badge } from "../ui/badge";
import { Check, CheckCircle2, Clock, PlusCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";

interface LaneProps {
  lane: {
    id: string;
    title: string;
  };
  tasks: Task[];
}

const laneIcons = {
  'Todo': <XCircle className="h-4 w-4 text-red-600" />,
  'In Progress': <Clock className="h-4 w-4 text-amber-600" />,
  'Done': <Check className="h-4 w-4 text-green-600" />,
};
const laneIconBg = {
  Todo: "bg-red-300",
  "In Progress": "bg-amber-300",
  Done: "bg-green-300",
};
export const Lane = ({ lane, tasks }: LaneProps) => {
  const { setNodeRef } = useDroppable({ id: lane.id });
  const currentIcon = laneIcons[lane.title as keyof typeof laneIcons] || <XCircle className="h-4 w-4 text-slate-600" />;
  const currentBg = laneIconBg[lane.title as keyof typeof laneIconBg] || "bg-slate-300";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

   
    <div ref={setNodeRef} className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
      <div className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-full ${currentBg} flex items-center justify-center`}>
                  {currentIcon}
                </div>
                <h3 className="font-medium text-slate-800">{lane.title}</h3>
                <Badge variant="outline" className="bg-slate-100 text-slate-600">
                  {tasks.length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PlusCircle className="h-4 w-4" />
              </Button>
        </div>

      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
      <div className="p-3 space-y-3">
        {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">Nenhuma tarefa ainda</p>
                  <Button variant="link" size="sm" className="mt-2">
                    Adicionar tarefa
                  </Button>
                </div>
        )}
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
      </div>
      </SortableContext>
    
    </div>
  );
}

