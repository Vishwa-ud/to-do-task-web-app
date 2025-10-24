package com.todo.service;

import com.todo.dto.TaskCreateDto;
import com.todo.dto.TaskResponseDto;
import com.todo.exception.ResourceNotFoundException;
import com.todo.model.Task;
import com.todo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Task operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    
    private static final int MAX_RECENT_TASKS = 5;
    private final TaskRepository taskRepository;
    
    /**
     * Get the most recent 5 incomplete tasks
     * @return list of task response DTOs
     */
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getRecentTasks() {
        log.debug("Fetching recent {} incomplete tasks", MAX_RECENT_TASKS);
        List<Task> tasks = taskRepository.findRecentIncompleteTasks(
            PageRequest.of(0, MAX_RECENT_TASKS)
        );
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Create a new task
     * @param taskCreateDto task creation data
     * @return created task response DTO
     */
    @Transactional
    public TaskResponseDto createTask(TaskCreateDto taskCreateDto) {
        log.debug("Creating new task with title: {}", taskCreateDto.getTitle());
        
        Task task = new Task();
        task.setTitle(taskCreateDto.getTitle());
        task.setDescription(taskCreateDto.getDescription());
        task.setCompleted(false);
        
        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with id: {}", savedTask.getId());
        
        return convertToDto(savedTask);
    }
    
    /**
     * Mark a task as completed
     * @param taskId task ID
     * @return updated task response DTO
     */
    @Transactional
    public TaskResponseDto markTaskAsCompleted(Long taskId) {
        log.debug("Marking task {} as completed", taskId);
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        
        task.setCompleted(true);
        Task updatedTask = taskRepository.save(task);
        
        log.info("Task {} marked as completed", taskId);
        return convertToDto(updatedTask);
    }
    
    /**
     * Get a task by ID
     * @param taskId task ID
     * @return task response DTO
     */
    @Transactional(readOnly = true)
    public TaskResponseDto getTaskById(Long taskId) {
        log.debug("Fetching task with id: {}", taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        return convertToDto(task);
    }
    
    /**
     * Get all tasks (for testing purposes)
     * @return list of all tasks
     */
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getAllTasks() {
        log.debug("Fetching all tasks");
        return taskRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Delete a task
     * @param taskId task ID
     */
    @Transactional
    public void deleteTask(Long taskId) {
        log.debug("Deleting task with id: {}", taskId);
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task", taskId);
        }
        taskRepository.deleteById(taskId);
        log.info("Task {} deleted successfully", taskId);
    }
    
    /**
     * Convert Task entity to TaskResponseDto
     * @param task task entity
     * @return task response DTO
     */
    private TaskResponseDto convertToDto(Task task) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.getCompleted());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}
