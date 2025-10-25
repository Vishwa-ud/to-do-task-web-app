import PropTypes from 'prop-types';

const TaskCard = ({ task, onComplete, onDelete }) => {
  const handleComplete = async () => {
    try {
      await onComplete(task.id);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-3 fade-in hover:shadow-md transition-shadow duration-200 relative">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-200"
        title="Delete task"
      >
        ✕
      </button>
      <div className="flex justify-between items-start pr-8">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{task.description}</p>
          <p className="text-xs text-gray-500">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 text-sm font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskCard;
