package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.TaskCreateDto;
import com.todo.dto.TaskResponseDto;
import com.todo.exception.ResourceNotFoundException;
import com.todo.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for TaskController
 */
@WebMvcTest(TaskController.class)
@DisplayName("Task Controller Tests")
class TaskControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private TaskService taskService;
    
    private TaskResponseDto testTaskResponse;
    
    @BeforeEach
    void setUp() {
        testTaskResponse = new TaskResponseDto();
        testTaskResponse.setId(1L);
        testTaskResponse.setTitle("Test Task");
        testTaskResponse.setDescription("Test Description");
        testTaskResponse.setCompleted(false);
        testTaskResponse.setCreatedAt(LocalDateTime.now());
        testTaskResponse.setUpdatedAt(LocalDateTime.now());
    }
    
    @Test
    @DisplayName("GET /api/tasks - Should return recent tasks")
    void shouldGetRecentTasks() throws Exception {
        // Given
        List<TaskResponseDto> tasks = Arrays.asList(testTaskResponse);
        when(taskService.getRecentTasks()).thenReturn(tasks);
        
        // When & Then
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].title").value("Test Task"));
    }
    
    @Test
    @DisplayName("POST /api/tasks - Should create task")
    void shouldCreateTask() throws Exception {
        // Given
        TaskCreateDto createDto = new TaskCreateDto("New Task", "New Description");
        when(taskService.createTask(any(TaskCreateDto.class))).thenReturn(testTaskResponse);
        
        // When & Then
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Test Task"));
    }
    
    @Test
    @DisplayName("POST /api/tasks - Should return 400 for invalid input")
    void shouldReturn400ForInvalidInput() throws Exception {
        // Given
        TaskCreateDto invalidDto = new TaskCreateDto("", "Description"); // Empty title
        
        // When & Then
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    @DisplayName("PUT /api/tasks/{id}/complete - Should mark task as completed")
    void shouldMarkTaskAsCompleted() throws Exception {
        // Given
        testTaskResponse.setCompleted(true);
        when(taskService.markTaskAsCompleted(eq(1L))).thenReturn(testTaskResponse);
        
        // When & Then
        mockMvc.perform(put("/api/tasks/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.completed").value(true));
    }
    
    @Test
    @DisplayName("PUT /api/tasks/{id}/complete - Should return 404 for non-existent task")
    void shouldReturn404ForNonExistentTask() throws Exception {
        // Given
        when(taskService.markTaskAsCompleted(eq(999L)))
                .thenThrow(new ResourceNotFoundException("Task", 999L));
        
        // When & Then
        mockMvc.perform(put("/api/tasks/999/complete"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
    
    @Test
    @DisplayName("GET /api/tasks/{id} - Should return task by ID")
    void shouldGetTaskById() throws Exception {
        // Given
        when(taskService.getTaskById(eq(1L))).thenReturn(testTaskResponse);
        
        // When & Then
        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Test Task"));
    }
    
    @Test
    @DisplayName("DELETE /api/tasks/{id} - Should delete task")
    void shouldDeleteTask() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Task deleted successfully"));
    }
}
