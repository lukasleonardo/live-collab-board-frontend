// components/Board/Lane.tsx
import { Task } from "@/lib/types";
import {TaskList} from "./TaskList";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface LaneProps {
  lane: {
    id: string;
    title: string;
  };
  tasks: Task[];
  lanes: { id: string; title: string }[];
  onAddTask: (taskData: any) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Lane = ({ lane, tasks, onDeleteTask }: LaneProps) => {
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
      <TaskList tasks={tasks}  onDeleteTask={onDeleteTask} />
      </SortableContext>

    </div>
  );
}
