const BASE = '/api';

async function request(path, options = {}) {
const res = await fetch(`${BASE}${path}`, {
headers: { 'Content-Type': 'application/json' },
...options,
});
if (!res.ok) {
const body = await res.json().catch(() => ({}));
throw new Error(body.error || `Request failed: ${res.status}`);
}
if (res.status === 204) return null;
return res.json();
}

export const api = {
getProjects: () => request('/projects'),
createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

getUsers: () => request('/users'),

getTasks: (projectId) => request(projectId ? `/tasks?projectId=${projectId}` : '/tasks'),
createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
