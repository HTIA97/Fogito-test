import { useEffect, useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';
import { api } from './api.js';

export default function App() {
const [projects, setProjects] = useState([]);
const [users, setUsers] = useState([]);
const [tasks, setTasks] = useState([]);
const [selectedProjectId, setSelectedProjectId] = useState(null);
const [modalTask, setModalTask] = useState(undefined); // undefined = closed, null = new, obj = edit
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const loadAll = useCallback(async () => {
try {
setError(null);
const [projectsRes, usersRes, tasksRes] = await Promise.all([
api.getProjects(),
api.getUsers(),
api.getTasks(),
]);
setProjects(projectsRes);
setUsers(usersRes);
setTasks(tasksRes);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
}, []);

useEffect(() => {
loadAll();
}, [loadAll]);

const visibleTasks = useMemo(
() => (selectedProjectId ? tasks.filter((t) => t.project_id === selectedProjectId) : tasks),
[tasks, selectedProjectId]
);

const currentProject = projects.find((p) => p.id === selectedProjectId);

async function handleCreateProject(data) {
const project = await api.createProject(data);
setProjects((p) => [...p, { ...project, taskCount: 0 }]);
}

async function handleStatusChange(taskId, status) {
const updated = await api.updateTask(taskId, { status });
setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, ...updated } : t)));
}

async function handleSaveTask(data) {
if (modalTask && modalTask.id) {
const updated = await api.updateTask(modalTask.id, data);
setTasks((ts) => ts.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
} else {
const created = await api.createTask(data);
setTasks((ts) => [...ts, created]);
setProjects((ps) =>
ps.map((p) => (p.id === created.project_id ? { ...p, taskCount: p.taskCount + 1 } : p))
);
}
setModalTask(undefined);
loadAll();
}

async function handleDeleteTask(taskId) {
await api.deleteTask(taskId);
setTasks((ts) => ts.filter((t) => t.id !== taskId));
setModalTask(undefined);
loadAll();
}

return (
<div className="app">
<Sidebar
projects={projects}
selectedProjectId={selectedProjectId}
onSelectProject={setSelectedProjectId}
onCreateProject={handleCreateProject}
/>

<main className="main">
<header className="main-header">
<div>
<h1>{currentProject ? currentProject.name : 'All tasks'}</h1>
{currentProject?.description && <p className="subtitle">{currentProject.description}</p>}
</div>
<button
className="btn-primary"
disabled={!selectedProjectId}
title={!selectedProjectId ? 'Select a project first' : ''}
onClick={() => setModalTask(null)}
>
+ New task
</button>
</header>

{loading && <p className="status-msg">Loading...</p>}
{error && <p className="status-msg error">Error: {error}</p>}

{!loading && !error && <Board tasks={visibleTasks} onTaskClick={setModalTask} onStatusChange={handleStatusChange} />}
</main>

{modalTask !== undefined && (
<TaskModal
task={modalTask}
projectId={modalTask?.project_id || selectedProjectId}
users={users}
onClose={() => setModalTask(undefined)}
onSave={handleSaveTask}
onDelete={handleDeleteTask}
/>
)}
</div>
);
}
