package com.jobtracker.service;

import com.jobtracker.dto.InterviewResponse;
import com.jobtracker.dto.JobRequest;
import com.jobtracker.dto.JobResponse;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.Interview;
import com.jobtracker.entity.Job;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<JobResponse> getAllJobs(User user, String sortBy) {
        List<Job> jobs = jobRepository.findByUserId(user.getId());
        sortJobs(jobs, sortBy);
        return jobs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id, User user) {
        Job job = findJobForUser(id, user.getId());
        return toResponseWithInterviews(job);
    }

    public JobResponse createJob(JobRequest request, User user) {
        Job job = new Job();
        mapRequestToJob(request, job);
        job.setUser(user);
        Job saved = jobRepository.save(job);
        return toResponse(saved);
    }

    public JobResponse updateJob(Long id, JobRequest request, User user) {
        Job job = findJobForUser(id, user.getId());
        mapRequestToJob(request, job);
        Job updated = jobRepository.save(job);
        return toResponseWithInterviews(updated);
    }

    public void deleteJob(Long id, User user) {
        Job job = findJobForUser(id, user.getId());
        jobRepository.delete(job);
    }

    public List<JobResponse> searchJobs(User user, String keyword, String sortBy) {
        List<Job> jobs = jobRepository.searchByUserIdAndKeyword(user.getId(), keyword);
        sortJobs(jobs, sortBy);
        return jobs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<JobResponse> filterByStatus(User user, ApplicationStatus status, String sortBy) {
        List<Job> jobs = jobRepository.findByUserIdAndStatus(user.getId(), status);
        sortJobs(jobs, sortBy);
        return jobs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Job findJobForUser(Long jobId, Long userId) {
        return jobRepository.findByIdAndUserId(jobId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found"));
    }

    private void mapRequestToJob(JobRequest request, Job job) {
        job.setCompanyName(request.getCompanyName());
        job.setJobTitle(request.getJobTitle());
        job.setLocation(request.getLocation());
        job.setStatus(request.getStatus());
        job.setJobUrl(request.getJobUrl());
        job.setAppliedDate(request.getAppliedDate());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());
        job.setDescription(request.getDescription());
        job.setNotes(request.getNotes());
    }

    private void sortJobs(List<Job> jobs, String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            jobs.sort(Comparator.comparing(Job::getAppliedDate).reversed());
            return;
        }

        switch (sortBy.toLowerCase()) {
            case "company" -> jobs.sort(Comparator.comparing(Job::getCompanyName, String.CASE_INSENSITIVE_ORDER));
            case "title" -> jobs.sort(Comparator.comparing(Job::getJobTitle, String.CASE_INSENSITIVE_ORDER));
            case "status" -> jobs.sort(Comparator.comparing(job -> job.getStatus().name()));
            default -> jobs.sort(Comparator.comparing(Job::getAppliedDate).reversed());
        }
    }

    private JobResponse toResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setCompanyName(job.getCompanyName());
        response.setJobTitle(job.getJobTitle());
        response.setLocation(job.getLocation());
        response.setStatus(job.getStatus());
        response.setJobUrl(job.getJobUrl());
        response.setAppliedDate(job.getAppliedDate());
        response.setSalary(job.getSalary());
        response.setJobType(job.getJobType());
        response.setDescription(job.getDescription());
        response.setNotes(job.getNotes());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        return response;
    }

    private JobResponse toResponseWithInterviews(Job job) {
        JobResponse response = toResponse(job);
        List<InterviewResponse> interviews = job.getInterviews().stream()
                .map(this::toInterviewResponse)
                .collect(Collectors.toList());
        response.setInterviews(interviews);
        return response;
    }

    private InterviewResponse toInterviewResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setInterviewDate(interview.getInterviewDate());
        response.setRound(interview.getRound());
        response.setType(interview.getType());
        response.setNotes(interview.getNotes());
        return response;
    }
}
