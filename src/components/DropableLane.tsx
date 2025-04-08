import { useDroppable } from "@dnd-kit/core";

type laneProps = {
    id: string;
    title: string;
    children: React.ReactNode;
}

export const DroppableLane = ({ id, title, children }:laneProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    backgroundColor: isOver ? "#f0f9ff" : "#f9fafb",
    padding: "1rem",
    borderRadius: "0.5rem",
  };


  return (
    <div ref={setNodeRef} style={style} className="bg-gray-200 p-4 rounded w-full space-y-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};
