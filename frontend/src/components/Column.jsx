import TaskCard from './TaskCard.jsx';

export default function Column({ id, title, tasks, onTaskClick, onDrop, onDragStart }) {
function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
const taskId = e.dataTransfer.getData('text/plain');
if (taskId) onDrop(Number(taskId), id);
}

return (
  <div className="column" onDragOver={handleDragOver} onDrop={handleDrop}>
  <div className="column-header">
  <h3>{title}</h3>
  <span className="column-count">{tasks.length}</span>
  </div>
  <div className="column-body">
  {tasks.map((task) => (
  <TaskCard key={task.id} task={task} onClick={onTaskClick} onDragStart={onDragStart} />
  ))}
{tasks.length === 0 && <p className="empty-column">No tasks</p>}
</div>
  </div>
  );
}
