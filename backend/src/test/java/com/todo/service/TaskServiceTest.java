package com.todo.service;

import com.todo.dto.TaskCreateDto;
import com.todo.dto.TaskResponseDto;
import com.todo.exception.ResourceNotFoundException;
import com.todo.model.Task;
import com.todo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TaskService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Task Service Tests")
class TaskServiceTest {
    
    @Mock
    private TaskRepository taskRepository;
    
    @InjectMocks
    private TaskService taskService;
    
    private Task testTask;
    
    @BeforeEach
    void setUp() {
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setCompleted(false);
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUpdatedAt(LocalDateTime.now());
    }
    
    @Test
    @DisplayName("Should get recent tasks")
    void shouldGetRecentTasks() {
        // Given
        List<Task> tasks = Arrays.asList(testTask);
        when(taskRepository.findRecentIncompleteTasks(any(PageRequest.class)))
                .thenReturn(tasks);
        
        // When
        List<TaskResponseDto> result = taskService.getRecentTasks();
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
        verify(taskRepository).findRecentIncompleteTasks(any(PageRequest.class));
    }
    
    @Test
    @DisplayName("Should create task successfully")
    void shouldCreateTask() {
        // Given
        TaskCreateDto createDto = new TaskCreateDto("New Task", "New Description");
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);
        
        // When
        TaskResponseDto result = taskService.createTask(createDto);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Task");
        verify(taskRepository).save(any(Task.class));
    }
    
    @Test
    @DisplayName("Should mark task as completed")
    void shouldMarkTaskAsCompleted() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // When
        TaskResponseDto result = taskService.markTaskAsCompleted(1L);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCompleted()).isTrue();
        verify(taskRepository).findById(1L);
        verify(taskRepository).save(any(Task.class));
    }
    
    @Test
    @DisplayName("Should throw exception when task not found for completion")
    void shouldThrowExceptionWhenTaskNotFoundForCompletion() {
        // Given
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> taskService.markTaskAsCompleted(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found with id: 999");
        
        verify(taskRepository).findById(999L);
        verify(taskRepository, never()).save(any(Task.class));
    }
    
    @Test
    @DisplayName("Should get task by ID")
    void shouldGetTaskById() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        
        // When
        TaskResponseDto result = taskService.getTaskById(1L);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Task");
        verify(taskRepository).findById(1L);
    }
    
    @Test
    @DisplayName("Should throw exception when task not found by ID")
    void shouldThrowExceptionWhenTaskNotFoundById() {
        // Given
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> taskService.getTaskById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found with id: 999");
        
        verify(taskRepository).findById(999L);
    }
    
    @Test
    @DisplayName("Should get all tasks")
    void shouldGetAllTasks() {
        // Given
        List<Task> tasks = Arrays.asList(testTask);
        when(taskRepository.findAll()).thenReturn(tasks);
        
        // When
        List<TaskResponseDto> result = taskService.getAllTasks();
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
        verify(taskRepository).findAll();
    }
    
    @Test
    @DisplayName("Should delete task")
    void shouldDeleteTask() {
        // Given
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);
        
        // When
        taskService.deleteTask(1L);
        
        // Then
        verify(taskRepository).existsById(1L);
        verify(taskRepository).deleteById(1L);
    }
    
    @Test
    @DisplayName("Should throw exception when deleting non-existent task")
    void shouldThrowExceptionWhenDeletingNonExistentTask() {
        // Given
        when(taskRepository.existsById(999L)).thenReturn(false);
        
        // When & Then
        assertThatThrownBy(() -> taskService.deleteTask(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found with id: 999");
        
        verify(taskRepository).existsById(999L);
        verify(taskRepository, never()).deleteById(anyLong());
    }
}
