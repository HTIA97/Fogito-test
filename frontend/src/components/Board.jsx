import Column from './Column.jsx';

const COLUMNS = [
{ id: 'todo', title: 'To Do' },
{ id: 'in_progress', title: 'In Progress' },
{ id: 'done', title: 'Done' },
];

export default function Board({ tasks, onTaskClick, onStatusChange }) {
function handleDragStart(e, task) {
  e.dataTransfer.setData('text/plain', String(task.id));
}

function handleDrop(taskId, status) {
  onStatusChange(taskId, status);
}

return (
  <div className="board">
  {COLUMNS.map((col) => (
  <Column
  key={col.id}
  id={col.id}
  title={col.title}
  tasks={tasks.filter((t) => t.status === col.id)}
  onTaskClick={onTaskClick}
  onDrop={handleDrop}
  onDragStart={handleDragStart}
  />
  ))}
</div>
  );
}
