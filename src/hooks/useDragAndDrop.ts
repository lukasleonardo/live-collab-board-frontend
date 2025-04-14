import {
    useSensor,
    useSensors,
    PointerSensor,
    DragOverEvent,
  } from "@dnd-kit/core";
  import { arrayMove } from "@dnd-kit/sortable";
  import { Task } from "@/lib/types";
  
  export const useDragAndDrop = (
    tasks: Task[],
    onReorder: (tasks: Task[], isChanged?: boolean) => void
  ) => {
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          delay: 250, // em milissegundos
          tolerance: 5, // pode mover o mouse até X px antes de cancelar o delay
        },
      })
    );
  
    const handleDragEnd = async (event: DragOverEvent) => {
      const { active, over } = event;
  
      if (!over || active.id === over.id) return;
  
      const activeTask = tasks.find((t) => t._id === active.id);
      const overTask = tasks.find((t) => t._id === over.id);
  
      if (!activeTask) return;
  
      const sourceLane = activeTask.laneId;
      const targetLane = overTask?.laneId || over.id; // over.id pode ser o ID da lane
  
      let updatedTasks = [...tasks];
  
      // Atualiza status (mudança de lane)
      if (sourceLane !== targetLane) {
        updatedTasks = updatedTasks.map((t) =>
          t._id === activeTask._id ? { ...t, laneId: String(targetLane) } : t
        );
      }
  
      // Reordena dentro da lane
      const sameLaneTasks = updatedTasks
        .filter((t) => t.laneId === targetLane)
        .sort((a, b) => a.order - b.order);
  
      const oldIndex = sameLaneTasks.findIndex((t) => t._id === active.id);
      const newIndex = sameLaneTasks.findIndex((t) => t._id === over.id);
  
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(sameLaneTasks, oldIndex, newIndex);
        const reorderedWithPosition = reordered.map((t, index) => ({
          ...t,
          order: index,
        }));
  
        updatedTasks = updatedTasks
          .filter((t) => t.laneId !== targetLane)
          .concat(reorderedWithPosition);
      }
  
      onReorder(updatedTasks, sourceLane !== targetLane);
    };
  
    return {
      onDragEnd: handleDragEnd,
      sensors,
    };
  };
  