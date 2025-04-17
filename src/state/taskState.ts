import { create } from "zustand";

interface Task {
  id: number;
  name: string;
  category: string;
  color: string;
  description: string;
  completed: boolean;
}

interface TaskState {
  activeTasks: Task[];
  completedTasks: Task[];
  addTask: (task: Task) => void;
  completeTask: (taskId: number) => void;
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
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
          activeTasks: state.activeTasks.filter((task) => task.id !== taskId),
          completedTasks: [
            ...state.completedTasks,
            { ...taskToComplete, completed: true },
          ],
        };
      }
      return state;
    }),
  clearCompletedTasks: () => set({ completedTasks: [] }),
}));
