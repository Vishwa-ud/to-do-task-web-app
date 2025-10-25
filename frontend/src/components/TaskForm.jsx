import { useState } from 'react';
import PropTypes from 'prop-types';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onTaskCreated({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl shadow-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">Add a Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-white mb-2 drop-shadow">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-95 border border-white border-opacity-40 rounded-lg focus:ring-2 focus:ring-white focus:ring-opacity-60 focus:border-transparent outline-none transition shadow-sm"
            placeholder="Enter task title"
            maxLength={255}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-white mb-2 drop-shadow">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-95 border border-white border-opacity-40 rounded-lg focus:ring-2 focus:ring-white focus:ring-opacity-60 focus:border-transparent outline-none transition resize-none shadow-sm"
            placeholder="Enter task description"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white bg-opacity-95 hover:bg-opacity-100 text-blue-700 font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  onTaskCreated: PropTypes.func.isRequired,
};

export default TaskForm;
