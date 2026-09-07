import { useState } from 'react';

export default function Sidebar({ projects, selectedProjectId, onSelectProject, onCreateProject }) {
const [showForm, setShowForm] = useState(false);
const [name, setName] = useState('');
const [description, setDescription] = useState('');

const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#0ea5e9', '#ef4444'];
const nextColor = colors[projects.length % colors.length];

function handleSubmit(e) {
e.preventDefault();
if (!name.trim()) return;
onCreateProject({ name, description, color: nextColor });
setName('');
setDescription('');
setShowForm(false);
}

return (
<aside className="sidebar">
<div className="sidebar-header">
<div className="logo-mark">F</div>
<span className="logo-text">Fogito</span>
</div>

<nav className="project-list">
<button
className={`project-item ${selectedProjectId === null ? 'active' : ''}`}
onClick={() => onSelectProject(null)}
>
<span className="dot" style={{ background: '#94a3b8' }} />
All tasks
</button>
{projects.map((p) => (
<button
key={p.id}
className={`project-item ${selectedProjectId === p.id ? 'active' : ''}`}
onClick={() => onSelectProject(p.id)}
>
<span className="dot" style={{ background: p.color }} />
<span className="project-name">{p.name}</span>
<span className="project-count">{p.taskCount}</span>
</button>
))}
</nav>

{showForm ? (
<form className="new-project-form" onSubmit={handleSubmit}>
<input
autoFocus
placeholder="Project name"
value={name}
onChange={(e) => setName(e.target.value)}
/>
<textarea
placeholder="Description (optional)"
value={description}
onChange={(e) => setDescription(e.target.value)}
rows={2}
/>
<div className="form-actions">
<button type="submit" className="btn-primary">Create</button>
<button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
Cancel
</button>
</div>
</form>
) : (
<button className="new-project-btn" onClick={() => setShowForm(true)}>
+ New project
</button>
)}
</aside>
);
}
