const { createTodo, deleteTodo } = require("./command/todoCommand");
const { getTodos, getTodoById } = require("./query/todoQuery");
const { startProjection } = require("./projection");

function title(text) {
	console.log("\n" + "=".repeat(70));
	console.log(text);
	console.log("=".repeat(70));
}

function step(text) {
	console.log("\n> " + text);
}

function printJSON(label, data) {
	console.log(label);
	console.log(JSON.stringify(data, null, 2));
}

title("CQRS TODO DEMO - Write Model, Event, Read Model");

step("1) Khoi dong projection de dong bo Read DB tu Event Bus");
startProjection();

step("2) Gui 2 command createTodo vao Write model");
const first = createTodo("Learn CQRS");
const second = createTodo("Build Read Model from Events");

printJSON("Write-side return value (todo vua tao):", { first, second });
printJSON("Read model sau khi nhan event TodoCreated:", getTodos());

step("3) Query mot todo theo id (chi doc Read model)");
printJSON(`Ket qua getTodoById(${second.id}):`, getTodoById(second.id));

step("4) Gui command deleteTodo vao Write model");
deleteTodo(first.id);

printJSON("Read model sau event TodoDeleted:", getTodos());

step("5) KET LUAN");
console.log("- Command khong doc truc tiep Read DB");
console.log("- Query khong ghi vao DB");
console.log("- Read model duoc cap nhat thong qua Event");
