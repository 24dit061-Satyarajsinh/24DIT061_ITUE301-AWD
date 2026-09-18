import TaskItem from './TaskItem.jsx';

function TaskList({ tasks, onToggleComplete, onUpdatePriority, onDelete }) {
  if (tasks.length === 0) {
    return <p className="status-text">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdatePriority={onUpdatePriority}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
