import { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Task } from '../types/Task';
import { TaskDot } from './TaskDot';

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 600;

const QuadrantOverlay = ({ title, className }: { title: string; className: string }) => (
  <div className={`absolute w-1/2 h-1/2 flex items-center justify-center pointer-events-none ${className}`}>
    <span className="text-2xl font-bold opacity-20">{title}</span>
  </div>
);

export const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPrompting, setIsPrompting] = useState(false);
  const [tempTask, setTempTask] = useState<{x: number; y: number} | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleBoardClick = (e: React.MouseEvent) => {
    if (isPrompting) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), BOARD_WIDTH - 20);
    const y = Math.min(Math.max(0, e.clientY - rect.top), BOARD_HEIGHT - 20);
    
    setTempTask({ x, y });
    setIsPrompting(true);
  };

  const handleTaskAdd = (text: string) => {
    if (!tempTask) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      x: tempTask.x,
      y: tempTask.y,
    };
    
    setTasks([...tasks, newTask]);
    setTempTask(null);
    setIsPrompting(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (!active) return;
    
    setTasks(prev => 
      prev.map(task => {
        if (task.id === active.id) {
          const newX = Math.min(Math.max(0, task.x + delta.x), BOARD_WIDTH - 20);
          const newY = Math.min(Math.max(0, task.y + delta.y), BOARD_HEIGHT - 20);
          return { ...task, x: newX, y: newY };
        }
        return task;
      })
    );
  };

  return (
    <div className="flex gap-4">
      <DndContext 
        sensors={sensors} 
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <div 
          className="relative w-[800px] h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-lg cursor-crosshair bg-white"
          onClick={handleBoardClick}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none" 
               style={{
                 backgroundImage: `
                   linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                   linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}
          />
          
          {/* Quadrant Overlays */}
          <QuadrantOverlay title="DO" className="top-0 left-0 bg-green-100/50" />
          <QuadrantOverlay title="SCHEDULE" className="top-0 right-0 bg-blue-100/50" />
          <QuadrantOverlay title="DELEGATE" className="bottom-0 left-0 bg-yellow-100/50" />
          <QuadrantOverlay title="DELETE" className="bottom-0 right-0 bg-red-100/50" />

          {/* Axis Labels */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-500 pointer-events-none">
            Urgent
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-500 pointer-events-none">
            Not Urgent
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-500 pointer-events-none">
            Important
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-sm font-medium text-gray-500 pointer-events-none">
            Not Important
          </div>

          {tasks.map(task => (
            <TaskDot key={task.id} task={task} />
          ))}
          
          {isPrompting && tempTask && (
            <div
              className="absolute"
              style={{ left: tempTask.x, top: tempTask.y }}
            >
              <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full opacity-50 shadow-md" />
              <input
                autoFocus
                className="absolute mt-1 border rounded px-2 py-1 bg-white shadow-sm"
                placeholder="Enter task..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleTaskAdd(e.currentTarget.value.trim());
                  } else if (e.key === 'Escape') {
                    setIsPrompting(false);
                    setTempTask(null);
                  }
                }}
                onBlur={() => {
                  setIsPrompting(false);
                  setTempTask(null);
                }}
              />
            </div>
          )}
        </div>
      </DndContext>
      
      <div className="w-[300px] border border-gray-200 rounded-lg p-4 shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4">Task List</h2>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="p-2 bg-gray-50 rounded">
              {task.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 