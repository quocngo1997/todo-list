import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITask } from "../../interfaces/Task";

interface TodoState {
  tasks: ITask[];
}

const initialState: TodoState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ITask>) => {
      state.tasks.push({
        id: Date.now(),
        title: action.payload?.title,
        description: action.payload?.description,
        completed: false,
      });
    },
    editTask: (state, action: PayloadAction<ITask>) => {
      const { id, title, description } = action.payload;
      const taskEdit = state.tasks.find((task) => task.id === id);
      if (taskEdit) {
        taskEdit.title = title;
        taskEdit.description = description;
      }
    },
    deleteTask: (state, action: PayloadAction<number | undefined>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTask: (state, action: PayloadAction<number | undefined>) => {
      const idTaskToggle = action.payload;
      const taskToggle = state.tasks.find((task) => task.id === idTaskToggle);
      if (taskToggle) {
        taskToggle.completed = !taskToggle.completed;
      }
    },
    dragDropTask: (
      state,
      action: PayloadAction<{ indexTaskDrag: number; indexTaskDrop: number }>
    ) => {
      const { indexTaskDrag, indexTaskDrop } = action.payload;
      const originTasks = [...state.tasks];
      originTasks.splice(indexTaskDrag, 1);
      originTasks.splice(indexTaskDrop - 1, 0, state.tasks[indexTaskDrag]);
      state.tasks = [...originTasks];
    },
    setDueDateTask: (
      state,
      action: PayloadAction<{ id?: number; dueDate: any }>
    ) => {
      const { id, dueDate } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.dueDate = dueDate;
      }
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  toggleTask,
  dragDropTask,
  setDueDateTask,
} = taskSlice.actions;
export default taskSlice.reducer;
