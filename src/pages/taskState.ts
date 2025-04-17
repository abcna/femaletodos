import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: number;
  name: string;
  category: string;
  color: string;
  description: string;
  completed: boolean;
  completedAt?: string; // Optional completedAt timestamp
}

interface TaskState {
  activeTasks: Task[];
  completedTasks: Task[];
  addTask: (task: Task) => void;
  completeTask: (taskId: number) => void;
  clearCompletedTasks: () => void;
  refreshTasks: () => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      activeTasks: [],
      completedTasks: [],
      addTask: (task) =>
        set((state) => ({
          activeTasks: [...state.activeTasks, task],
        })),
      completeTask: (taskId) =>
        set((state) => {
          const taskToComplete = state.activeTasks.find(
            (task) => task.id === taskId
          );
          if (taskToComplete) {
            return {
              activeTasks: state.activeTasks.filter(
                (task) => task.id !== taskId
              ),
              completedTasks: [
                {
                  ...taskToComplete,
                  completed: true,
                  completedAt: new Date().toISOString(),
                },
                ...state.completedTasks,
              ],
            };
          }
          return state;
        }),
      clearCompletedTasks: () => set({ completedTasks: [] }),
      refreshTasks: () => {
        const storedTasks = localStorage.getItem("task-storage");
        if (storedTasks) {
          const parsed = JSON.parse(storedTasks);
          set({
            activeTasks: parsed.state.activeTasks || [],
            completedTasks: parsed.state.completedTasks || [],
          });
        }
      },
    }),
    {
      name: "task-storage",
    }
  )
);

export default useTaskStore;
