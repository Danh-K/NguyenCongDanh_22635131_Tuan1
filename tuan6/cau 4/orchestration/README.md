# Food Project - Orchestration Pattern

## Flow
1. `order-service` publish `order.created`
2. `orchestrator` receive and send command `payment.process`
3. `payment-service` process and reply `payment.completed`
4. `orchestrator` send command `restaurant.prepare`
5. `restaurant-service` process and reply `restaurant.prepared`
6. `orchestrator` send command `delivery.dispatch`
7. `delievery` process and reply `delivery.completed`
8. `orchestrator` publish `order.completed`

## Run
```bash
npm install
```

Open 5 terminals:

```bash
npm run start:orchestrator
npm run start:payment
npm run start:restaurant
npm run start:delivery
npm run start:order
```

Create an order:

```bash
curl -X POST http://localhost:3001/order \
  -H "Content-Type: application/json" \
  -d '{"items":["pizza","cola"]}'
```
