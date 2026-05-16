# Lab Tuan 7 - CQRS va Event Sourcing (Khong dung Saga)

## 1) CQRS Todo

Thu muc: `cqrs-todo`

Y tuong:
- Command (`command/todoCommand.js`): ghi vao write model va phat event.
- Projection (`projection.js`): nghe event de dong bo read model.
- Query (`query/todoQuery.js`): chi doc read model.

Chay demo:

```bash
node cqrs-todo/demo.js
```

Ky vong:
- Tao 2 todo
- Doc danh sach tu read model
- Xoa 1 todo theo id
- Doc lai danh sach da cap nhat

## 2) Event Sourcing Bank Account

Thu muc: `event-sourcing-bank`

Y tuong:
- Event Store (`eventStore.js`): luu toan bo su kien.
- Command (`commands.js`): validate business rule roi ghi event.
- Replay (`account.js`): tinh state bang cach phat lai events.
- Time travel (`getStateAt`): xem state tai mot moc su kien.
- Projection (`projection.js`): tao read model tong hop.
- Snapshot (`snapshot.js`): tang toc replay bang state moc trung gian.

Chay demo:

```bash
node event-sourcing-bank/demo.js
```

Ky vong:
- Tao tai khoan, nap/rut tien
- Replay ra state hien tai
- Time travel theo so event
- Tao summary projection
- Tao snapshot va replay tu snapshot + events moi

## 3) Ghi nho de thi

CQRS:
- Tach Read va Write model
- Read model cap nhat qua event
- Scale doc/ghi linh hoat

Event Sourcing:
- Luu event thay vi luu state cuoi
- State = replay(events)
- Ho tro audit, undo/time-travel, snapshot
