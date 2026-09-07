# Fogito Task Manager

A full-stack task management application for Fogito - organize projects, tasks, assignees, priorities, and due dates on a simple Kanban board.

## Stack

- **Backend:** Node.js + Express + SQLite (via `better-sqlite3`)
- **Frontend:** React + Vite

## Project structure

```
Fogito-test/
  backend/              # REST API + SQLite database
    server.js           # Express app & routes
    db.js               # Database connection & schema
    seed.js              # Seeds the database with sample data
    data/
      seed-data.json     # Sample projects, users & tasks (source of truth for seeding)
  frontend/             # React + Vite single-page app
    src/
      App.jsx
      api.js
      components/
```

## Getting started

### 1. Backend (API + database)

```bash
cd backend
npm install
npm run seed      # creates backend/data/fogito.db and populates it with sample data
npm start          # starts the API on http://localhost:4000
```

Available endpoints:

| Method | Endpoint                    | Description                       |
|--------|------------------------------|------------------------------------|
| GET    | /api/health                  | Health check                       |
| GET    | /api/projects                | List all projects                  |
| POST   | /api/projects                | Create a project                   |
| GET    | /api/users                   | List all users                     |
| GET    | /api/tasks                   | List tasks (optional `?projectId=`)|
| POST   | /api/tasks                   | Create a task                      |
| PATCH  | /api/tasks/:id                | Update a task (status, fields...)  |
| DELETE | /api/tasks/:id                | Delete a task                      |

### 2. Frontend (Kanban board UI)

In a second terminal:

```bash
cd frontend
npm install
npm run dev        # starts the UI on http://localhost:5173
```

The dev server proxies `/api` requests to the backend on port 4000 (see `frontend/vite.config.js`), so run the backend first.

## Sample data

`backend/data/seed-data.json` ships with 3 sample projects, 5 team members, and ~18 tasks spread across the "To Do", "In Progress", and "Done" columns, with priorities and due dates already assigned. Running `npm run seed` (re)creates the SQLite database from this file, so you can freely reset your local data at any time.

## Notes

- The generated SQLite file (`backend/data/fogito.db`) is not committed to git - it's regenerated locally by `npm run seed`. The sample data itself lives in `backend/data/seed-data.json` and *is* committed, so the dataset is always reproducible.
