// components/Board/TaskList.tsx
import { Task } from "@/lib/types";
import {TaskCard} from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

export const TaskList = ({ tasks, onDeleteTask }: TaskListProps) =>{
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onDeleteTask={onDeleteTask} />
      ))}
    </div>
  );
}
