package com.todo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller
 * This controller provides a simple endpoint to check whether
 * the backend service is running and responsive.
 */
@RestController
@RequestMapping("/api") // Base URL path for all endpoints in this controller
public class HealthController {

    /**
     * Health check endpoint
     * ---------------------
     * Method: GET
     * URL: /api/health
     * 
     * When a client or monitoring system calls this endpoint,
     * it returns a JSON response indicating the service status.
     *
     * Example Response:
     * {
     *   "status": "UP",
     *   "service": "todo-backend"
     * }
     */
    
    @GetMapping("/health") // Maps HTTP GET requests to this method
    public ResponseEntity<Map<String, String>> health() {

        // Create a map to hold the response data
        Map<String, String> response = new HashMap<>();
        // Add key-value pairs to indicate the service status
        response.put("status", "UP");
        response.put("service", "todo-backend");
        // Return the response as an HTTP 200 OK with JSON body
        return ResponseEntity.ok(response);
    }
}
