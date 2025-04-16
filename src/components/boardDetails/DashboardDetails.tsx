// components/Board/DashboardDetails.tsx
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Board, Task } from "@/lib/types";
import {Lane} from "./Lane";
import {  useEffect, useState } from "react";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "@/hooks/useTaskStore";

type DashboardDetailsProps = {
  board: Board;
};

export const DashboardDetails= ( {board}: DashboardDetailsProps) =>{ 
  const { tasks, loading, reorder, fetchTasks, query } = useTaskStore()
  const { onDragEnd, sensors } = useDragAndDrop(tasks, reorder);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const activeTask = tasks.find((task) => task._id === activeTaskId);

  useEffect(() => {
    if(!board._id) return
    fetchTasks(board._id)
  },[board._id, fetchTasks])

  if (loading) return <p>Carregando tarefas...</p>;
  if (!board) {
    return <div>Carregando board...</div>;
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
        const laneTasks = tasks.filter((task: Task) => task.laneId === lane.id).filter((task) =>
          task.title.toLowerCase().includes(query.toLowerCase())
        );;

        return (
          <Lane
            key={lane.id}
            lane={lane}
            tasks={laneTasks}
          />
        );
      })}
    </div>
        <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
