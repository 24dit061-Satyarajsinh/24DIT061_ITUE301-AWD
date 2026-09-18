function TaskItem({ task, onToggleComplete, onUpdatePriority, onDelete }) {
  return (
    <li className={`task-item priority-${task.priority}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
        />
        <div className="task-text">
          <span className={task.completed ? 'title completed' : 'title'}>
            {task.title}
          </span>
          {task.description && <p className="description">{task.description}</p>}
          <span className="timestamp">
            Created: {new Date(task.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <select
          value={task.priority}
          onChange={(e) => onUpdatePriority(task, e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="delete-btn" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
