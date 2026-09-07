const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

export default function TaskCard({ task, onClick, onDragStart }) {
const isOverdue =
task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date();

return (
<div
className="task-card"
draggable
onDragStart={(e) => onDragStart(e, task)}
onClick={() => onClick(task)}
>
<div className="task-card-top">
<span className={`priority-badge priority-${task.priority}`}>
{PRIORITY_LABEL[task.priority]}
</span>
{task.due_date && (
<span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
</span>
)}
</div>
<p className="task-title">{task.title}</p>
{task.description && <p className="task-description">{task.description}</p>}
{task.assignee_name && (
<div className="assignee">
<span className="avatar" style={{ background: task.assignee_color }}>
{task.assignee_name.charAt(0)}
</span>
<span className="assignee-name">{task.assignee_name}</span>
</div>
)}
</div>
);
}
