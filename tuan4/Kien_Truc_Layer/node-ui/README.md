# Layer Architecture - Node.js UI

Simple Node.js UI for CRUD operations with Layer Architecture backend.

## Setup

```bash
npm install
```

## Running

### Option 1: Start both backend and frontend

**Terminal 1 - Backend (PowerShell):**
```powershell
cd d:\Quan_Ly_Mon_Hoc\Kien_Truc_He_Thong\Lab1\tuan4\Kien_Truc_Layer
powershell -ExecutionPolicy Bypass -File .\run-backend.ps1
```

**Terminal 2 - Frontend (Node.js):**
```bash
cd d:\Quan_Ly_Mon_Hoc\Kien_Truc_He_Thong\Lab1\tuan4\Kien_Truc_Layer\node-ui
npm start
```

### Option 2: Custom backend address

```powershell
$env:BACKEND_BASE='http://your-server:8081'
npm start
```

## UI Features

- **Users Management**: Create, read, update, delete system users
- **Content Management**: Create and publish content items
- **Settings Management**: Configure system settings
- **Operation Logs**: Real-time operation tracking
- **Backend Status**: Live health check indicator

## Endpoints Used

- `GET/POST /api/admin/users` - User list and creation
- `GET/PUT/DELETE /api/admin/users/{id}` - User details, update, delete
- `GET/POST /api/admin/contents` - Content list and creation
- `GET/PUT/DELETE /api/admin/contents/{id}` - Content details, update, delete
- `PATCH /api/admin/contents/{id}/publish` - Publish content
- `GET/PUT /api/admin/settings` - Settings list and upsert

## Default Ports

- Backend: 8081 (Spring Boot)
- Frontend: 3000 (Node.js)
