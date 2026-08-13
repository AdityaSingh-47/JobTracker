package com.jobtracker.controller;

import com.jobtracker.dto.JobRequest;
import com.jobtracker.dto.JobResponse;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.User;
import com.jobtracker.service.AuthService;
import com.jobtracker.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final AuthService authService;

    public JobController(JobService jobService, AuthService authService) {
        this.jobService = jobService;
        this.authService = authService;
    }

    @GetMapping
    public List<JobResponse> getAllJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String sortBy) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return jobService.getAllJobs(user, sortBy);
    }

    @GetMapping("/{id}")
    public JobResponse getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return jobService.getJobById(id, user);
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        JobResponse response = jobService.createJob(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return jobService.updateJob(id, request, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        jobService.deleteJob(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<JobResponse> searchJobs(
            @RequestParam String keyword,
            @RequestParam(required = false) String sortBy,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return jobService.searchJobs(user, keyword, sortBy);
    }

    @GetMapping("/status/{status}")
    public List<JobResponse> filterByStatus(
            @PathVariable ApplicationStatus status,
            @RequestParam(required = false) String sortBy,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return jobService.filterByStatus(user, status, sortBy);
    }
}
