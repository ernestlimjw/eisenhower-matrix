import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/Task';

interface TaskDotProps {
  task: Task;
}

export const TaskDot = ({ task }: TaskDotProps) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: task.id,
    data: task
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute',
    left: `${task.x}px`,
    top: `${task.y}px`,
    touchAction: 'none',
    zIndex: isDragging ? 1000 : 1
  } as const;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-move transition-all ${isDragging ? 'scale-105' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md" />
      <div className="absolute mt-1 px-2 py-1 text-sm bg-white rounded shadow-sm border border-gray-200 whitespace-nowrap">
        {task.text}
      </div>
    </div>
  );
}; 