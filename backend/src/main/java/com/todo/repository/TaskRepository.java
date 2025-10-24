package com.todo.repository;

import com.todo.model.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Task entity
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    /**
     * Find incomplete tasks ordered by creation date descending
     * @param pageable pagination information
     * @return list of incomplete tasks
     */
    @Query("SELECT t FROM Task t WHERE t.completed = false ORDER BY t.createdAt DESC")
    List<Task> findRecentIncompleteTasks(Pageable pageable);
    
    /**
     * Count incomplete tasks
     * @return count of incomplete tasks
     */
    long countByCompletedFalse();
}
