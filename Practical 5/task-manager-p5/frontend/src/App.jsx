import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { fetchTasks, createTask, updateTask, deleteTask } from './api.js';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (task) => {
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [newTask, ...prev]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePriority = async (task, priority) => {
    try {
      const updated = await updateTask(task._id, { priority });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Practical 5 — Express + Mongoose + MongoDB + React</p>
      </header>

      <TaskForm onCreate={handleCreate} />

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="status-text">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onUpdatePriority={handleUpdatePriority}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
