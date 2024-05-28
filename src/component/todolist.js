// TodoList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInitialState,
  addTodoAsync,
  updateTodoAsync,
  deleteTodoAsync,
  todoSelector,
} from "../features/todo/todoReducer";
import "./todolist.css";

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector(todoSelector);
  const [filter, setFilter] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [update, setUpdate] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  useEffect(() => {
    dispatch(setInitialState());
  }, [dispatch]);

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      dispatch(
        addTodoAsync({
          userId: 1,
          title: inputValue.trim(),
          completed: false,
        })
      );
      setInputValue("");
    }
  };

  const updateTodo = () => {
    if (todoToEdit && inputValue.trim() !== "") {
      dispatch(updateTodoAsync({ ...todoToEdit, title: inputValue.trim() }));
      setUpdate(false);
      setInputValue("");
      setTodoToEdit(null);
    }
  };

  const toggleTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      dispatch(updateTodoAsync({ ...todo, completed: !todo.completed }));
    }
  };

  const deleteTodo = (id) => {
    dispatch(deleteTodoAsync(id));
  };

  const handleEdit = (todo) => {
    setUpdate(true);
    setInputValue(todo.title);
    setTodoToEdit(todo);
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div id="inputbox">
        <input
          type="text"
          id="todoInput"
          placeholder="Add a new todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {update ? (
          <button className="update-btn" onClick={updateTodo}>
            Update
          </button>
        ) : (
          <button onClick={addTodo} className="btn">
            Add
          </button>
        )}
      </div>
      <div id="todoList">
        {filteredTodos.map((todo, index) => (
          <div
            key={index}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <span onClick={() => toggleTodo(todo.id)}>{todo.title}</span>
            <div className="button-align">
              <button className="update-btn" onClick={() => handleEdit(todo)}>
                Edit
              </button>
              <button
                className="btn delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div id="detailsdiv">
        <p>
          Task completed:{" "}
          <span id="totalTasks">
            {todos.filter((todo) => todo.completed).length}
          </span>
        </p>
        <div id="atagsDiv">
          <a onClick={() => handleFilterChange("all")}>All tasks</a>
          <a onClick={() => handleFilterChange("completed")}>Completed</a>
          <a onClick={() => handleFilterChange("incomplete")}>
            Yet to complete
          </a>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
