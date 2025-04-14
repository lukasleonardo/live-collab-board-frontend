// components/Board/DashboardDetails.tsx
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Board, Task } from "@/lib/types";
import {Lane} from "./Lane";
import {  useState } from "react";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

interface DashboardDetailsProps {
  board:Board;
  tasks: Task[];
  loading: boolean;
  handleAddTask: (taskData: any) => void;
  handleDelete: (id: string) => void;
  handleDragEnd: (event: any) => void;
}

export const DashboardDetails= ({  board, tasks, loading, handleAddTask, handleDelete, handleDragEnd }: DashboardDetailsProps) =>{
 
  
  const { onDragEnd, sensors } = useDragAndDrop(tasks, handleDragEnd);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const activeTask = tasks.find((task) => task._id === activeTaskId);



  if (loading) return <p>Carregando tarefas...</p>;
  if (!board) {
    return <div>Carregando board...</div>; // ou um spinner
  }
  return (
    <DndContext sensors={sensors}
    collisionDetection={closestCorners}
    onDragStart={(event) => setActiveTaskId(String(event.active.id))}
    onDragEnd={(event) => {
      setActiveTaskId(null);
      onDragEnd(event);
    }}
    onDragCancel={() => setActiveTaskId(null)}>
    <div className="flex gap-4 overflow-x-auto justify-center" >
      {board.lanes.map((lane) => {
        const laneTasks = tasks.filter((task: Task) => task.laneId === lane.id);

        return (
          <Lane
            key={lane.id}
            lane={lane}
            lanes={board.lanes}
            tasks={laneTasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDelete}
          />
        );
      })}
    </div>
        <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} onDeleteTask={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
