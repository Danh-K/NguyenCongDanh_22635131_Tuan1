const { writeDB } = require("../db");
const { publish } = require("../eventBus");

let nextTodoId = 1;

function createTodo(title) {
  if (!title || !title.trim()) {
    throw new Error("Title must not be empty");
  }

  const todo = {
    id: nextTodoId++,
    title: title.trim(),
    createdAt: new Date().toISOString(),
  };

  writeDB.push(todo);
  publish({ type: "TodoCreated", payload: todo });

  return todo;
}

function deleteTodo(id) {
  const numericId = Number(id);
  const index = writeDB.findIndex((todo) => todo.id === numericId);

  if (index === -1) {
    return null;
  }

  const [removedTodo] = writeDB.splice(index, 1);
  publish({ type: "TodoDeleted", payload: removedTodo });

  return removedTodo;
}

module.exports = { createTodo, deleteTodo };
