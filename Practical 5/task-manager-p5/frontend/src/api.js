// All requests go to the Express server from the backend/ folder.
// Update this if your backend runs on a different port.
const API_BASE = 'http://localhost:5000/api/tasks';

function extractErrorMessage(data, fallback) {
  if (Array.isArray(data.error)) return data.error.join(', ');
  return data.error || fallback;
}

export async function fetchTasks() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to fetch tasks'));
  return data.data;
}

export async function createTask(task) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to create task'));
  return data.data;
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to update task'));
  return data.data;
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to delete task'));
  return data;
}
