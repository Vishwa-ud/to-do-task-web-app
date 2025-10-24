package com.todo.repository;

import com.todo.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for TaskRepository
 */
@DataJpaTest
@TestPropertySource(locations = "classpath:application-test.properties")
@DisplayName("Task Repository Tests")
class TaskRepositoryTest {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }
    
    @Test
    @DisplayName("Should find recent incomplete tasks")
    void shouldFindRecentIncompleteTasks() {
        // Given
        Task task1 = createTask("Task 1", "Description 1", false);
        Task task2 = createTask("Task 2", "Description 2", false);
        Task task3 = createTask("Task 3", "Description 3", true); // completed
        
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        
        // When
        List<Task> result = taskRepository.findRecentIncompleteTasks(PageRequest.of(0, 5));
        
        // Then
        assertThat(result).hasSize(2);
        assertThat(result).extracting(Task::getCompleted).containsOnly(false);
    }
    
    @Test
    @DisplayName("Should return tasks in descending order by creation date")
    void shouldReturnTasksInDescendingOrder() throws InterruptedException {
        // Given
        Task task1 = createTask("First Task", "Description", false);
        taskRepository.save(task1);
        
        Thread.sleep(100); // Ensure different timestamps
        
        Task task2 = createTask("Second Task", "Description", false);
        taskRepository.save(task2);
        
        // When
        List<Task> result = taskRepository.findRecentIncompleteTasks(PageRequest.of(0, 5));
        
        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Second Task");
        assertThat(result.get(1).getTitle()).isEqualTo("First Task");
    }
    
    @Test
    @DisplayName("Should respect page size limit")
    void shouldRespectPageSizeLimit() {
        // Given
        for (int i = 1; i <= 10; i++) {
            taskRepository.save(createTask("Task " + i, "Description", false));
        }
        
        // When
        List<Task> result = taskRepository.findRecentIncompleteTasks(PageRequest.of(0, 5));
        
        // Then
        assertThat(result).hasSize(5);
    }
    
    @Test
    @DisplayName("Should count incomplete tasks")
    void shouldCountIncompleteTasks() {
        // Given
        taskRepository.save(createTask("Task 1", "Description", false));
        taskRepository.save(createTask("Task 2", "Description", false));
        taskRepository.save(createTask("Task 3", "Description", true));
        
        // When
        long count = taskRepository.countByCompletedFalse();
        
        // Then
        assertThat(count).isEqualTo(2);
    }
    
    private Task createTask(String title, String description, boolean completed) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setCompleted(completed);
        return task;
    }
}
