package com.todo.controller;

import com.todo.dto.ApiResponse;
import com.todo.dto.TaskCreateDto;
import com.todo.dto.TaskResponseDto;
import com.todo.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Task operations
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:5173"})
public class TaskController {
    
    private final TaskService taskService;
    
    /**
     * Get the most recent 5 incomplete tasks
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponseDto>>> getRecentTasks() {
        log.info("GET /api/tasks - Fetching recent tasks");
        List<TaskResponseDto> tasks = taskService.getRecentTasks();
        return ResponseEntity.ok(
            ApiResponse.success("Tasks retrieved successfully", tasks)
        );
    }
    
    /**
     * Create a new task
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDto>> createTask(
            @Valid @RequestBody TaskCreateDto taskCreateDto) {
        log.info("POST /api/tasks - Creating new task");
        TaskResponseDto task = taskService.createTask(taskCreateDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }
    
    /**
     * Mark a task as completed
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<TaskResponseDto>> completeTask(
            @PathVariable Long id) {
        log.info("PUT /api/tasks/{}/complete - Marking task as completed", id);
        TaskResponseDto task = taskService.markTaskAsCompleted(id);
        return ResponseEntity.ok(
            ApiResponse.success("Task marked as completed", task)
        );
    }
    
    /**
     * Get a task by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDto>> getTaskById(
            @PathVariable Long id) {
        log.info("GET /api/tasks/{} - Fetching task", id);
        TaskResponseDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(
            ApiResponse.success("Task retrieved successfully", task)
        );
    }
    
    /**
     * Delete a task
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        log.info("DELETE /api/tasks/{} - Deleting task", id);
        taskService.deleteTask(id);
        return ResponseEntity.ok(
            ApiResponse.success("Task deleted successfully", null)
        );
    }
}
