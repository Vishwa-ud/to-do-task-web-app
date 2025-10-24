package com.todo.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.TaskCreateDto;
import com.todo.model.Task;
import com.todo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for Task API
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@DisplayName("Task API Integration Tests")
class TaskApiIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }
    
    @Test
    @DisplayName("Should create, retrieve, and complete task")
    void shouldCreateRetrieveAndCompleteTask() throws Exception {
        // Create a task
        TaskCreateDto createDto = new TaskCreateDto("Integration Test Task", "Testing end-to-end");
        
        String response = mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Integration Test Task"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        // Extract task ID from response
        Long taskId = objectMapper.readTree(response).get("data").get("id").asLong();
        
        // Retrieve the task
        mockMvc.perform(get("/api/tasks/" + taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Integration Test Task"))
                .andExpect(jsonPath("$.data.completed").value(false));
        
        // Mark as completed
        mockMvc.perform(put("/api/tasks/" + taskId + "/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completed").value(true));
        
        // Verify in database
        Task task = taskRepository.findById(taskId).orElseThrow();
        assertThat(task.getCompleted()).isTrue();
    }
    
    @Test
    @DisplayName("Should return only 5 most recent incomplete tasks")
    void shouldReturnOnlyFiveRecentIncompleteTasks() throws Exception {
        // Create 7 tasks
        for (int i = 1; i <= 7; i++) {
            Task task = new Task();
            task.setTitle("Task " + i);
            task.setDescription("Description " + i);
            task.setCompleted(false);
            taskRepository.save(task);
        }
        
        // Get recent tasks
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(5)));
    }
    
    @Test
    @DisplayName("Should not return completed tasks in recent list")
    void shouldNotReturnCompletedTasksInRecentList() throws Exception {
        // Create 3 incomplete tasks
        for (int i = 1; i <= 3; i++) {
            Task task = new Task();
            task.setTitle("Incomplete Task " + i);
            task.setCompleted(false);
            taskRepository.save(task);
        }
        
        // Create 2 completed tasks
        for (int i = 1; i <= 2; i++) {
            Task task = new Task();
            task.setTitle("Completed Task " + i);
            task.setCompleted(true);
            taskRepository.save(task);
        }
        
        // Get recent tasks
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)));
    }
    
    @Test
    @DisplayName("Should delete task")
    void shouldDeleteTask() throws Exception {
        // Create a task
        Task task = new Task();
        task.setTitle("Task to Delete");
        task.setCompleted(false);
        Task savedTask = taskRepository.save(task);
        
        // Delete the task
        mockMvc.perform(delete("/api/tasks/" + savedTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        
        // Verify deletion
        assertThat(taskRepository.findById(savedTask.getId())).isEmpty();
    }
    
    @Test
    @DisplayName("Should return 404 for non-existent task")
    void shouldReturn404ForNonExistentTask() throws Exception {
        mockMvc.perform(get("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
