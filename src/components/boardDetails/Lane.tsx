// components/Board/Lane.tsx
import { Task } from "@/lib/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

interface LaneProps {
  lane: {
    id: string;
    title: string;
  };
  tasks: Task[];
}

export const Lane = ({ lane, tasks }: LaneProps) => {
  const { setNodeRef } = useDroppable({ id: lane.id });
  
  return (
    <div ref={setNodeRef} className="bg-white dark:bg-gray-800 border-2 border-solid border-gray-500 mb-10 rounded-lg shadow-lg hover:shadow-xl p-4 w-[300px] flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{lane.title}</h2>
      </div>

      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
      <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
      </div>
      </SortableContext>

    </div>
  );
}
