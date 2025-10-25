import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('renders form elements correctly', () => {
    const mockOnTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    expect(screen.getByText('Add a Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('updates title and description when typing', () => {
    const mockOnTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    expect(titleInput.value).toBe('Test Task');
    expect(descriptionInput.value).toBe('Test Description');
  });

  it('shows error when submitting without title', async () => {
    const mockOnTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('calls onTaskCreated with correct data when form is submitted', async () => {
    const mockOnTaskCreated = vi.fn().mockResolvedValue({});
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnTaskCreated).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task Description',
      });
    });
  });

  it('clears form after successful submission', async () => {
    const mockOnTaskCreated = vi.fn().mockResolvedValue({});
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });
});
