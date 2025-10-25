import PropTypes from 'prop-types';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onTaskComplete, onTaskDelete, loading, error }) => {
  if (loading) {
    return (
      <div className="glass-effect rounded-xl shadow-xl p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect rounded-xl shadow-xl p-6">
        <div className="text-center py-8">
          <div className="text-red-300 text-lg mb-2">⚠️ Error</div>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">Recent Tasks</h2>
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-white text-5xl mb-4">📝</div>
          <p className="text-white text-lg drop-shadow">No tasks yet</p>
          <p className="text-white text-opacity-80 text-sm mt-2 drop-shadow">Create your first task to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onComplete={onTaskComplete} onDelete={onTaskDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onTaskComplete: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default TaskList;
