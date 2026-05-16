const { getEvents } = require("./eventStore");
const { replay, getStateAt } = require("./account");
const { createAccount, deposit, withdraw } = require("./commands");
const { buildSummary } = require("./projection");
const { createSnapshot, replayFromSnapshot, getSnapshot } = require("./snapshot");

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

title("EVENT SOURCING BANK DEMO - Event Log -> Replay -> State");

step("1) Thuc thi command theo dong thoi gian");
createAccount();
deposit(1000);
withdraw(200);
deposit(500);

const allEvents = getEvents();
const currentState = replay(allEvents);

printJSON("Event log hien tai:", allEvents);

step("2) Replay toan bo events de tinh state hien tai");
printJSON("Current state from replay:", currentState);

step("3) Time-travel: xem state tai moc 2 events dau");
printJSON("State after first 2 events:", getStateAt(2, allEvents));

step("4) Projection cho read model tong hop");
printJSON("Projection summary:", buildSummary(allEvents));

step("5) Tao snapshot de giam chi phi replay");
createSnapshot(allEvents);
printJSON("Snapshot:", getSnapshot());

step("6) Co them event moi sau snapshot");
withdraw(100);

const newestEvents = getEvents();
printJSON("State from snapshot + tail events:", replayFromSnapshot(newestEvents));

step("7) KET LUAN");
console.log("- Event Store luu lich su thay doi, khong chi luu state cuoi");
console.log("- Co the replay, time-travel, audit va snapshot de toi uu");
