import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from '../components/TaskList';

describe('TaskList', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      createdAt: '2024-01-01T10:00:00',
      completed: false,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      createdAt: '2024-01-02T10:00:00',
      completed: false,
    },
  ];

  it('renders loading state', () => {
    const mockOnTaskComplete = vi.fn();
    const mockOnTaskDelete = vi.fn();
    render(
      <TaskList
        tasks={[]}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
        loading={true}
        error=""
      />
    );

    // Check for the spinning loader by its distinctive class
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockOnTaskComplete = vi.fn();
    const mockOnTaskDelete = vi.fn();
    render(
      <TaskList
        tasks={[]}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
        error="Failed to load tasks"
      />
    );

    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
  });

  it('renders empty state when no tasks', () => {
    const mockOnTaskComplete = vi.fn();
    const mockOnTaskDelete = vi.fn();
    render(
      <TaskList
        tasks={[]}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
        error=""
      />
    );

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('renders tasks correctly', () => {
    const mockOnTaskComplete = vi.fn();
    const mockOnTaskDelete = vi.fn();
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
        error=""
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders Recent Tasks heading', () => {
    const mockOnTaskComplete = vi.fn();
    const mockOnTaskDelete = vi.fn();
    render(
      <TaskList
        tasks={mockTasks}
        onTaskComplete={mockOnTaskComplete}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
        error=""
      />
    );

    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
  });
});
