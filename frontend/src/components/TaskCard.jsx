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
    <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-4 mb-3 fade-in hover:bg-opacity-40 transition-all duration-200 relative border border-white border-opacity-30 shadow-md">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white text-opacity-80 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-30 rounded-full transition duration-200"
        title="Delete task"
      >
        ✕
      </button>
      <div className="flex justify-between items-start pr-8">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1 drop-shadow-md">{task.title}</h3>
          <p className="text-gray-700 text-opacity-95 text-sm mb-2 drop-shadow">{task.description}</p>
          <p className="text-xs text-gray-700 text-opacity-80 drop-shadow">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-white bg-opacity-95 hover:bg-opacity-100 text-blue-700 rounded-md transition duration-200 text-sm font-semibold shadow-lg hover:shadow-xl"
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
