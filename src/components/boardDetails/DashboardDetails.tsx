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
      <div className="flex flex-col md:flex-row gap-6 md:overflow-x-auto md:justify-center w-full px-2">
        {board.lanes.map((lane) => {
          const laneTasks = tasks.filter(
            (task) =>
              task.laneId === lane.id &&
              task.title.toLowerCase().includes(query.toLowerCase())
          );

          return <Lane key={lane.id} lane={lane} tasks={laneTasks} />;
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
