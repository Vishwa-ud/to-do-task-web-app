import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    createdAt: '2024-01-01T10:00:00',
    completed: false,
  };

  it('renders task information correctly', () => {
    const mockOnComplete = vi.fn();
    const mockOnDelete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('calls onComplete when Done button is clicked', () => {
    const mockOnComplete = vi.fn();
    const mockOnDelete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} onDelete={mockOnDelete} />);

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    expect(mockOnComplete).toHaveBeenCalledWith(1);
  });

  it('formats date correctly', () => {
    const mockOnComplete = vi.fn();
    const mockOnDelete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
  });
});
