import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getRecentTasks, createTask, completeTask, deleteTask } from './services/api';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getRecentTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = async (taskData) => {
    await createTask(taskData);
    await fetchTasks();
  };

  const handleTaskComplete = async (taskId) => {
    await completeTask(taskId);
    // Remove the completed task from the list with animation
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      // Remove the deleted task from the list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              To-Do Task Manager
            </span>
          </h1>
          <p className="text-xl text-white drop-shadow-md font-medium">
            ✨ Organize your tasks efficiently ✨
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Task Form */}
          <div>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>

          {/* Right Column - Task List */}
          <div>
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
              onTaskDelete={handleTaskDelete}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xl text-xl text-white drop-shadow-md font-medium">
          <p>Showing only the most recent 5 incomplete tasks</p>
        </div>
      </div>
    </div>
  );
}

export default App;
