const { subscribe } = require("./eventBus");
const { readDB } = require("./db");

function startProjection() {
  subscribe((event) => {
    switch (event.type) {
      case "TodoCreated":
        readDB.push(event.payload);
        break;
      case "TodoDeleted": {
        const index = readDB.findIndex((todo) => todo.id === event.payload.id);
        if (index !== -1) {
          readDB.splice(index, 1);
        }
        break;
      }
      default:
        break;
    }
  });
}

module.exports = { startProjection };
