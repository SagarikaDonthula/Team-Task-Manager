import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/tasks');
        const tasks = response.data;
        
        const now = new Date();
        let total = tasks.length;
        let completed = 0;
        let pending = 0;
        let overdue = 0;

        tasks.forEach(task => {
          if (task.status === 'Done') {
            completed++;
          } else {
            pending++;
            if (task.dueDate && new Date(task.dueDate) < now) {
              overdue++;
            }
          }
        });

        setStats({ total, completed, pending, overdue });
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  }

  const statCards = [
    { name: 'Total Tasks', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { name: 'Completed Tasks', value: stats.completed, icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Pending Tasks', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
    { name: 'Overdue Tasks', value: stats.overdue, icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your tasks.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.color} rounded-md p-3`}>
                    <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
