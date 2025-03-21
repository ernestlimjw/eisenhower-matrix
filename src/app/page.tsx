'use client';

import { TaskBoard } from '../components/TaskBoard';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Eisenhower Matrix Task Manager</h1>
      <TaskBoard />
    </main>
  );
}
