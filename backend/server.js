const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ---------- Health ----------
app.get('/api/health', (req, res) => {
res.json({ ok: true, time: new Date().toISOString() });
});

// ---------- Users ----------
app.get('/api/users', (req, res) => {
const users = db.prepare('SELECT * FROM users ORDER BY name').all();
res.json(users);
});

// ---------- Projects ----------
app.get('/api/projects', (req, res) => {
const projects = db.prepare('SELECT * FROM projects ORDER BY created_at').all();
const taskCounts = db
.prepare('SELECT project_id, COUNT(*) AS count FROM tasks GROUP BY project_id')
.all();
const countByProject = Object.fromEntries(taskCounts.map((r) => [r.project_id, r.count]));
res.json(projects.map((p) => ({ ...p, taskCount: countByProject[p.id] || 0 })));
});

app.post('/api/projects', (req, res) => {
const { name, description = '', color = '#6366f1' } = req.body;
if (!name || !name.trim()) {
return res.status(400).json({ error: 'name is required' });
}
const info = db
.prepare('INSERT INTO projects (name, description, color) VALUES (?, ?, ?)')
.run(name.trim(), description, color);
const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
res.status(201).json(project);
});

app.delete('/api/projects/:id', (req, res) => {
const info = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
if (info.changes === 0) return res.status(404).json({ error: 'not found' });
res.status(204).end();
});

// ---------- Tasks ----------
app.get('/api/tasks', (req, res) => {
const { projectId } = req.query;
let tasks;
if (projectId) {
tasks = db
.prepare(
`SELECT t.*, u.name AS assignee_name, u.color AS assignee_color
FROM tasks t LEFT JOIN users u ON u.id = t.assignee_id
WHERE t.project_id = ? ORDER BY t.created_at`
)
.all(projectId);
} else {
tasks = db
.prepare(
`SELECT t.*, u.name AS assignee_name, u.color AS assignee_color
FROM tasks t LEFT JOIN users u ON u.id = t.assignee_id
ORDER BY t.created_at`
)
.all();
}
res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
const {
project_id,
title,
description = '',
status = 'todo',
priority = 'medium',
assignee_id = null,
due_date = null,
} = req.body;

if (!project_id || !title || !title.trim()) {
return res.status(400).json({ error: 'project_id and title are required' });
}

const info = db
.prepare(
`INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date)
VALUES (?, ?, ?, ?, ?, ?, ?)`
)
.run(project_id, title.trim(), description, status, priority, assignee_id, due_date);

const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
if (!existing) return res.status(404).json({ error: 'not found' });

const merged = { ...existing, ...req.body };
db.prepare(
`UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?,
assignee_id = ?, due_date = ?, project_id = ?, updated_at = datetime('now')
WHERE id = ?`
).run(
merged.title,
merged.description,
merged.status,
merged.priority,
merged.assignee_id,
merged.due_date,
merged.project_id,
req.params.id
);

const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
if (info.changes === 0) return res.status(404).json({ error: 'not found' });
res.status(204).end();
});

app.listen(PORT, () => {
console.log(`Fogito Task Manager API running on http://localhost:${PORT}`);
});
