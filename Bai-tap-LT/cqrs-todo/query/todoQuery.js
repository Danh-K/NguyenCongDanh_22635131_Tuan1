const { readDB } = require("../db");

function getTodos() {
  return [...readDB];
}

function getTodoById(id) {
  const numericId = Number(id);
  return readDB.find((todo) => todo.id === numericId) || null;
}

module.exports = { getTodos, getTodoById };
