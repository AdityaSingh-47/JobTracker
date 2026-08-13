package com.jobtracker.controller;

import com.jobtracker.dto.InterviewRequest;
import com.jobtracker.dto.InterviewResponse;
import com.jobtracker.entity.User;
import com.jobtracker.service.AuthService;
import com.jobtracker.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class InterviewController {

    private final InterviewService interviewService;
    private final AuthService authService;

    public InterviewController(InterviewService interviewService, AuthService authService) {
        this.interviewService = interviewService;
        this.authService = authService;
    }

    @GetMapping("/api/jobs/{jobId}/interviews")
    public List<InterviewResponse> getInterviews(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return interviewService.getInterviews(jobId, user);
    }

    @PostMapping("/api/jobs/{jobId}/interviews")
    public ResponseEntity<InterviewResponse> createInterview(
            @PathVariable Long jobId,
            @Valid @RequestBody InterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        InterviewResponse response = interviewService.createInterview(jobId, request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/interviews/{id}")
    public InterviewResponse updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return interviewService.updateInterview(id, request, user);
    }

    @DeleteMapping("/api/interviews/{id}")
    public ResponseEntity<Void> deleteInterview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        interviewService.deleteInterview(id, user);
        return ResponseEntity.noContent().build();
    }
}
