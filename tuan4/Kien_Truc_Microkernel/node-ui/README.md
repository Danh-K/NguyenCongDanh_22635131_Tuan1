# Node UI for Microkernel Backend

Giao dien don gian dung Node.js + Express de thao tac CRUD voi backend Spring Boot.

## 1) Chay backend

Trong thu muc goc du an:

```powershell
.\mvnw.cmd spring-boot:run
```

Mac dinh backend o: http://localhost:8081

## 2) Chay frontend Node UI

```powershell
cd node-ui
npm install
npm start
```

Mo trinh duyet: http://localhost:3000

## Bien moi truong tuy chon

- UI_PORT: cong chay frontend (mac dinh 3000)
- BACKEND_BASE: URL backend (mac dinh http://localhost:8081)

Vi du:

```powershell
$env:UI_PORT=3010
$env:BACKEND_BASE="http://localhost:8081"
npm start
```
