# Cau 5 - Food App chia 5 nguoi qua LAN

Mo hinh gom 5 thanh vien, moi nguoi phu trach 1 thanh phan:

1. Frontend - cong 8081
2. Order Service - cong 8082
3. Restaurant Service - cong 8083
4. Payment Service - cong 8084
5. Delivery Service - cong 8085

## Kien truc ket noi
Frontend goi truc tiep tung service qua IP LAN:

- FE -> Order
- FE -> Payment
- FE -> Restaurant
- FE -> Delivery

## Goi y chia may theo de bai

- May 1: `192.168.1.10:8081` (frontend)
- May 2: `192.168.1.11:8082` (order-service)
- May 3: `192.168.1.12:8083` (restaurant-service)
- May 4: `192.168.1.13:8084` (payment-service)
- May 5: `192.168.1.14:8085` (delivery-service)

Ban co the thay doi IP theo mang LAN thuc te cua nhom.

## Chuan bi
Moi may cai Node.js >= 18.

## Chay tung thanh phan

### 1) Frontend
```bash
cd frontend
npm install
# tao .env tu .env.example va sua lai IP service
npm start
```

### 2) Order Service
```bash
cd services/order-service
npm install
# tao .env tu .env.example (neu can)
npm start
```

### 3) Restaurant Service
```bash
cd services/restaurant-service
npm install
npm start
```

### 4) Payment Service
```bash
cd services/payment-service
npm install
npm start
```

### 5) Delivery Service
```bash
cd services/delivery-service
npm install
npm start
```

## Test nhanh
Mo frontend tai `http://<IP_FE>:8081`, nhap thong tin va bam nut dat mon.
Frontend se goi lan luot:

1. Tao order
2. Thanh toan
3. Bep chuan bi
4. Tao don giao
5. Xac nhan da giao
6. Cap nhat order `COMPLETED`

## API chinh

### Order Service
- `POST /orders`
- `PATCH /orders/:id/status`
- `GET /orders/:id`

### Restaurant Service
- `GET /menu`
- `POST /kitchen/prepare`
- `GET /kitchen/:orderId`

### Payment Service
- `POST /payments/charge`
- `GET /payments/:orderId`

### Delivery Service
- `POST /deliveries/create`
- `PATCH /deliveries/:orderId/complete`
- `GET /deliveries/:orderId`
