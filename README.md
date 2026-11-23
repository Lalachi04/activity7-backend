# Activity 7 — Backend Development

Study Support Requests REST API using Express and a local JSON file for storage. This version intentionally avoids native SQLite modules to reduce installation problems on Node.js 24 / Windows.

## Requirements
- Node.js 20 or newer
- VS Code

## Run
1. Open this folder in VS Code.
2. Terminal → New Terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Visit http://localhost:3000

Stop with Ctrl+C.

## Routes
| Method | Route | Purpose |
|---|---|---|
| GET | `/` | API guide |
| GET | `/health` | Health check |
| GET | `/api/records` | List records |
| GET | `/api/records/:id` | Read one record |
| POST | `/api/records` | Create a record |
| PUT | `/api/records/:id` | Update a record |
| DELETE | `/api/records/:id` | Delete a record |

Records are saved in `data/records.json`.

## POST /api/records example
```json
{
  "title": "Help with HTML basics",
  "description": "I need help understanding page structure.",
  "status": "pending"
}
```
Allowed status values: `pending`, `in-progress`, `completed`. Title length: 3–80 characters.
