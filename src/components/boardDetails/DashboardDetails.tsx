import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Board } from "@/lib/types";
import { Lane } from "./Lane";
import { useEffect, useState, useMemo } from "react";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "@/store/useTaskStore";
import { useTaskActions } from "@/hooks/actions/useTaskActions";
import { useTaskSocketListeners } from "@/hooks/socket/useTaskSocketListener";
import { useBoardStore } from "@/store/useBoardStore";
import { useSocketContext } from "@/hooks/socket/SocketContext";

type DashboardDetailsProps = {
  board: Board;
};

export const DashboardDetails = ({ board }: DashboardDetailsProps) => {
  const socket = useSocketContext();
  useTaskSocketListeners(socket);
  const tasks   = useTaskStore(s => s.tasks);
  const loading = useTaskStore(s => s.loading);
  const query   = useTaskStore(s => s.query);
  const currentBoardId = useBoardStore((state) => state.currentBoardId);
  const { fetchTasks, handleReorderTasks } = useTaskActions(currentBoardId!);

  const { onDragEnd, sensors } = useDragAndDrop(tasks, handleReorderTasks);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const activeTask = useMemo(
    () => tasks.find((task) => task._id === activeTaskId),
    [activeTaskId, tasks]
  );

  useEffect(() => {
    if (!currentBoardId) return;
    fetchTasks(currentBoardId);
  }, [currentBoardId, fetchTasks]);

  if (loading) return <p className="text-center">Carregando tarefas...</p>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => setActiveTaskId(String(event.active.id))}
      onDragEnd={(event) => {
        setActiveTaskId(null);
        onDragEnd(event);
      }}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <main className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {board.lanes.map((lane) => {
          const laneTasks = tasks.filter(
            (task) =>
              task.laneId === lane.id &&
              task.title.toLowerCase().includes(query.toLowerCase())
          );

          return <Lane key={lane.id} lane={lane} tasks={laneTasks} />;
        })}
      </div>
</main>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
