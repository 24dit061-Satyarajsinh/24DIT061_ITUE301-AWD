# Practical 5 — MongoDB Integration and Schema Design with Mongoose

Task Management system extended from Practical 4. The in-memory array has been
replaced with a real MongoDB database accessed through Mongoose, plus a React
frontend to exercise the API visually.

## Architecture

```
React Frontend (Vite, port 3000)
        |
        | fetch() -> http://localhost:5000/api/tasks
        v
Express App (port 5000)
        |
        v  app.use()
[cors] -> [express.json()] -> [logger] -> [requireJsonContentType]
        |
        v
Express Router (/api/tasks)
  ├── GET    /api/tasks       -> getAllTasks
  ├── POST   /api/tasks       -> createTask
  ├── GET    /api/tasks/:id   -> validateObjectId -> getTaskById
  ├── PUT    /api/tasks/:id   -> validateObjectId -> updateTask
  └── DELETE /api/tasks/:id   -> validateObjectId -> deleteTask
        |
        v
Mongoose ODM (Task model / schema validation)
        |
        v
MongoDB Database
  └── tasks collection
        { title, description, completed, priority, createdAt }
        |
        v
[404 handler] -> [Global Error Handler] -> structured JSON error response
```

Schema validation (required fields, defaults, enum) is enforced by Mongoose
**before** any document reaches MongoDB — MongoDB itself stays schema-less.

## Folder structure

```
task-manager-p5/
├── backend/
│   ├── models/Task.js              # Mongoose schema + pre-save hook
│   ├── controllers/taskController.js
│   ├── routes/taskRoutes.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── requireJsonContentType.js
│   │   ├── validateObjectId.js
│   │   └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── frontend/
    ├── src/
    │   ├── components/TaskForm.jsx, TaskList.jsx, TaskItem.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Setup (Windows / VS Code)

You said MongoDB + mongosh are already installed. Make sure the MongoDB
service is running (Windows usually starts it automatically as a service;
otherwise run `mongod` in a terminal, or check via `mongosh` that it connects
to `mongodb://127.0.0.1:27017`).

### 1. Backend

```powershell
cd backend
npm install
copy .env.example .env
```

Edit `.env` if needed (default already points at your local MongoDB):

```
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
```

Run it:

```powershell
npm run dev
```

You should see:

```
MongoDB connected
Server running on port 5000
```

### 2. Frontend

Open a **second** terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the printed URL (default `http://localhost:3000`). The React app talks
to the API at `http://localhost:5000/api/tasks`.

### 3. Verify persistence

Add a task in the UI, then stop and restart the backend (`Ctrl+C`, `npm run
dev` again). The task should still be there — confirming it's stored in
MongoDB, not in memory. You can also open **MongoDB Compass** (or run
`mongosh` and `use taskmanager; db.tasks.find().pretty()`) to see the raw
documents.

## Testing with Postman

Base URL: `http://localhost:5000/api/tasks`

| Method | URL              | Body (JSON)                                                        | Expected |
|--------|------------------|---------------------------------------------------------------------|----------|
| GET    | `/`              | —                                                                    | 200, list of tasks |
| POST   | `/`              | `{ "title": "Write report", "priority": "high" }`                  | 201, created task |
| POST   | `/`              | `{ "description": "no title" }`                                     | 400, structured validation error |
| GET    | `/:id`           | —                                                                    | 200, task / 404 if missing |
| GET    | `/invalid-id`    | —                                                                    | 400, invalid ID format |
| PUT    | `/:id`           | `{ "completed": true }`                                              | 200, updated task |
| PUT    | `/:id`           | `{ "priority": "urgent" }`                                           | 400, enum validation error |
| DELETE | `/:id`           | —                                                                    | 200, `{ data: {} }` |

Remember to set the request header `Content-Type: application/json` on
POST/PUT — the `requireJsonContentType` middleware rejects requests without
it (this is deliberate, matching the Practical 4 supplementary problem).

### Example validation error shape

```json
{
  "success": false,
  "error": ["Title is required"]
}
```

This is the "clean, structured" error the practical asks for — never the raw
Mongoose `ValidationError` object with its stack trace.

## Supplementary problems implemented

- **Priority enum** — `models/Task.js`, restricted to `low | medium | high`,
  rejecting anything else with a clear Mongoose enum error message.
- **Pre-save trim hook** — `models/Task.js`, `taskSchema.pre('save', ...)`
  trims whitespace from `title` (in addition to schema-level `trim: true`).
- **`GET /tasks/:id` with 404 handling** — `controllers/taskController.js`
  `getTaskById`, paired with `middleware/validateObjectId.js` for malformed
  IDs (400) vs. well-formed-but-missing IDs (404).

## Key concepts (for viva)

- **Why a schema on a schema-less database?** MongoDB will store any shape of
  document, so nothing stops a buggy write from saving garbage data. Mongoose
  schemas enforce structure, types, and constraints at the application layer
  before a write is even attempted — this is the "shift left" of data
  integrity, independent of what any individual frontend does.
- **Why not rely on frontend validation alone?** Frontend validation can be
  bypassed (Postman, curl, a modified client, a bug in a different frontend).
  Server-side/schema-level validation is the actual enforcement point; the
  frontend check is only a UX convenience.
- **What happens when validation fails?** `Task.create()` / `findByIdAndUpdate
  (..., { runValidators: true })` reject with a `ValidationError` before any
  write touches MongoDB. The promise rejects, the `catch` block in the
  controller runs, and `next(err)` forwards it to the global error handler,
  which reshapes it into `{ success: false, error: [...] }` and responds with
  `400` — the request never reaches the database.

## Common mistakes avoided here

- `.env` is git-ignored; `.env.example` is committed instead.
- Every field that must never be empty (`title`) has `required: true`.
- Every async Mongoose call is wrapped in `try/catch`, forwarding to
  `next(err)` — no unhandled promise rejections.
- The error handler formats Mongoose errors into clean JSON instead of
  leaking the raw error object/stack trace to the client.
