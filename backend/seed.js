const fs = require('fs');
const path = require('path');
const db = require('./db');

const seedData = JSON.parse(
fs.readFileSync(path.join(__dirname, 'data', 'seed-data.json'), 'utf-8')
);

function seed() {
const insertMany = db.transaction(() => {
db.prepare('DELETE FROM tasks').run();
db.prepare('DELETE FROM projects').run();
db.prepare('DELETE FROM users').run();

const insertUser = db.prepare(
'INSERT INTO users (name, email, color) VALUES (@name, @email, @color)'
);
const userIdByEmail = {};
for (const user of seedData.users) {
const info = insertUser.run(user);
userIdByEmail[user.email] = info.lastInsertRowid;
}

const insertProject = db.prepare(
'INSERT INTO projects (name, description, color) VALUES (@name, @description, @color)'
);
const projectIdByName = {};
for (const project of seedData.projects) {
const info = insertProject.run(project);
projectIdByName[project.name] = info.lastInsertRowid;
}

const insertTask = db.prepare(`
INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date)
VALUES (@project_id, @title, @description, @status, @priority, @assignee_id, @due_date)
`);
for (const task of seedData.tasks) {
insertTask.run({
project_id: projectIdByName[task.project],
title: task.title,
description: task.description || '',
status: task.status,
priority: task.priority,
assignee_id: task.assignee ? userIdByEmail[task.assignee] || null : null,
due_date: task.due_date || null,
});
}
});

insertMany();

const counts = {
users: db.prepare('SELECT COUNT(*) AS c FROM users').get().c,
projects: db.prepare('SELECT COUNT(*) AS c FROM projects').get().c,
tasks: db.prepare('SELECT COUNT(*) AS c FROM tasks').get().c,
};
console.log('Seed complete:', counts);
}

seed();
