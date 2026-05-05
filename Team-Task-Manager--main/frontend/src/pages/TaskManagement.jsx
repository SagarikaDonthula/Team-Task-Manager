import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit } from 'lucide-react';
import clsx from 'clsx';

const TaskManagement = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', status: 'Todo' });
  const [currentTask, setCurrentTask] = useState(null);
  
  const [submitError, setSubmitError] = useState('');

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        user?.role === 'Admin' ? api.get('/projects') : Promise.resolve({ data: [] })
      ]);
      setTasks(tasksRes.data);
      if (user?.role === 'Admin') {
        setProjects(projectsRes.data);
        if (projectsRes.data.length > 0) {
          setNewTask(prev => ({...prev, projectId: projectsRes.data[0]._id}));
        }
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await api.post('/tasks', newTask);
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', projectId: projects[0]?._id || '', status: 'Todo' });
      fetchData();
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await api.put(`/tasks/${currentTask._id}`, { status: currentTask.status });
      setShowStatusModal(false);
      fetchData();
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const openStatusModal = (task) => {
    setCurrentTask(task);
    setShowStatusModal(true);
  };

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Done': 'bg-green-100 text-green-800'
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all tasks assigned to you or created by you.</p>
        </div>
        {user?.role === 'Admin' && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Task
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500 text-sm">No tasks found.</li>
          ) : (
            tasks.map((task) => (
              <li key={task._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-dark truncate">{task.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  <p className="mt-1 text-xs text-gray-400">Project: {task.projectId?.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={clsx("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", statusColors[task.status])}>
                    {task.status}
                  </span>
                  <button
                    onClick={() => openStatusModal(task)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Update Status"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Create Task Modal (Admin Only) */}
      {showCreateModal && user?.role === 'Admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6">
              {submitError && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{submitError}</div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    required
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border py-2 px-3"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border py-2 px-3"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent px-6 py-2 bg-primary text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 px-6 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Update Task Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleUpdateStatus} className="p-6">
              {submitError && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{submitError}</div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={currentTask.status}
                  onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border py-2 px-3"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent px-6 py-2 bg-primary text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Save Status
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 px-6 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
