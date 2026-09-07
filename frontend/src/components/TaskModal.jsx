import { useState, useEffect } from 'react';

const emptyTask = {
  title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee_id: '',
    due_date: '',
    };

export default function TaskModal({ task, projectId, users, onClose, onSave, onDelete }) {
const [form, setForm] = useState(emptyTask);
const isEditing = Boolean(task);

useEffect(() => {
if (task) {
setForm({
  title: task.title || '',
  description: task.description || '',
  status: task.status || 'todo',
  priority: task.priority || 'medium',
  assignee_id: task.assignee_id || '',
  due_date: task.due_date || '',
  });
} else {
setForm(emptyTask);
}
}, [task]);

function update(field, value) {
  setForm((f) => ({ ...f, [field]: value }));
}

function handleSubmit(e) {
  e.preventDefault();
if (!form.title.trim()) return;
onSave({
  ...form,
  project_id: projectId,
  assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
  due_date: form.due_date || null,
  });
}

return (
  <div className="modal-overlay" onClick={onClose}>
  <div className="modal" onClick={(e) => e.stopPropagation()}>
<div className="modal-header">
<h2>{isEditing ? 'Edit task' : 'New task'}</h2>
<button className="icon-btn" onClick={onClose}>X</button>
</div>
<form onSubmit={handleSubmit} className="modal-form">
<label>
Title
<input
autoFocus
value={form.title}
onChange={(e) => update('title', e.target.value)}
placeholder="Task title"
required
/>
</label>

<label>
Description
<textarea
rows={3}
value={form.description}
onChange={(e) => update('description', e.target.value)}
placeholder="Add more detail..."
/>
</label>

<div className="modal-row">
<label>
Status
<select value={form.status} onChange={(e) => update('status', e.target.value)}>
<option value="todo">To Do</option>
<option value="in_progress">In Progress</option>
<option value="done">Done</option>
</select>
</label>

<label>
Priority
<select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
</label>
</div>

<div className="modal-row">
<label>
Assignee
<select value={form.assignee_id} onChange={(e) => update('assignee_id', e.target.value)}>
<option value="">Unassigned</option>
{users.map((u) => (
<option key={u.id} value={u.id}>{u.name}</option>
))}
</select>
</label>

<label>
Due date
<input
type="date"
value={form.due_date || ''}
onChange={(e) => update('due_date', e.target.value)}
/>
</label>
</div>

<div className="modal-actions">
{isEditing && (
<button
type="button"
className="btn-danger"
onClick={() => onDelete(task.id)}
>
Delete
</button>
)}
<div className="spacer" />
<button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
<button type="submit" className="btn-primary">Save</button>
</div>
</form>
</div>
</div>
);
}
