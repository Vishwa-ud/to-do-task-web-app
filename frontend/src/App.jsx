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
    try {
      await createTask(taskData);
      // Immediately refresh to show the new task
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      // Optimistically remove from UI first for smooth UX
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      
      // Complete the task on server
      await completeTask(taskId);
      
      // Fetch fresh data to show the next available task
      setTimeout(async () => {
        await fetchTasks();
      }, 300); // Small delay for smooth transition
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task');
      console.error('Error completing task:', err);
      // Revert on error
      await fetchTasks();
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      // Optimistically remove from UI first for smooth UX
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      
      // Delete the task on server
      await deleteTask(taskId);
      
      // Fetch fresh data to show the next available task
      setTimeout(async () => {
        await fetchTasks();
      }, 300); // Small delay for smooth transition
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
      // Revert on error
      await fetchTasks();
    }
  };

  return (
    <div className="min-h-screen px-4 pt-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              To-Do Task Manager
            </span>
          </h1>
          <p className="text-xl text-white drop-shadow-md font-medium">
            Organize your tasks efficiently
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

        <br />
        <br />
        <br />
        <br />

        {/* Footer - fixed glass effect */}
        <footer className="fixed inset-x-0 bottom-0 z-50">
          <div className="backdrop-blur-md bg-white/10 border-t border-white/20 shadow-inner">
            <div className="max-w-6xl mx-auto py-3 px-4">
              <p className="text-center text-sm text-white font-medium">
                © 2025 <span className="font-semibold">Vishwa Udaynatha</span>. All rights reserved.
              </p>
            </div>
          </div>
        </footer>


      </div>
    </div>
  );
}

export default App;
