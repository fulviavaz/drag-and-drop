"use client";

import { Card,CardTitle } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";

interface TaskProps {
    task: {
        id: string;
        name: string;
    };
    index: number;
}

export function Task({ task, index }: TaskProps) {
  return (
      <Draggable draggableId={task.id} index={index}>
          {(provided) => (
              <Card ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
      className="w-full bg-zinc-300 mb-2 last:mb-0 px-2 py-3 rounded border-[2px] border-zinc-400"
    >
      <CardTitle className="text-base">{task.name}</CardTitle>
    </Card>
          )}
    </Draggable>
  );
}