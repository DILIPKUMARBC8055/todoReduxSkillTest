// store.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = { todos: [] };

export const setInitialState = createAsyncThunk("todo/initState", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );
  return response.data;
});

export const addTodoAsync = createAsyncThunk("todo/addTodo", async (todo) => {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/todos",
    todo
  );
  return response.data;
});

export const updateTodoAsync = createAsyncThunk(
  "todo/updateTodo",
  async (todo) => {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      todo
    );
    return response.data;
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todo/deleteTodo",
  async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    return id;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    toggle: (state, action) => {
      const index = state.todos.findIndex((todo) => action.payload === todo.id);
      if (index !== -1) {
        state.todos[index].completed = !state.todos[index].completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitialState.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export const todoActions = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
export const todoSelector = (state) => state.todoReducer.todos;
