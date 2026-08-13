package com.jobtracker.service;

import com.jobtracker.dto.InterviewRequest;
import com.jobtracker.dto.InterviewResponse;
import com.jobtracker.entity.Interview;
import com.jobtracker.entity.Job;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobService jobService;

    public InterviewService(InterviewRepository interviewRepository, JobService jobService) {
        this.interviewRepository = interviewRepository;
        this.jobService = jobService;
    }

    public List<InterviewResponse> getInterviews(Long jobId, User user) {
        jobService.findJobForUser(jobId, user.getId());
        return interviewRepository.findByJobId(jobId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public InterviewResponse createInterview(Long jobId, InterviewRequest request, User user) {
        Job job = jobService.findJobForUser(jobId, user.getId());

        Interview interview = new Interview();
        interview.setInterviewDate(request.getInterviewDate());
        interview.setRound(request.getRound());
        interview.setType(request.getType());
        interview.setNotes(request.getNotes());
        interview.setJob(job);

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    public InterviewResponse updateInterview(Long id, InterviewRequest request, User user) {
        Interview interview = interviewRepository.findByIdAndJobUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        interview.setInterviewDate(request.getInterviewDate());
        interview.setRound(request.getRound());
        interview.setType(request.getType());
        interview.setNotes(request.getNotes());

        Interview updated = interviewRepository.save(interview);
        return toResponse(updated);
    }

    public void deleteInterview(Long id, User user) {
        Interview interview = interviewRepository.findByIdAndJobUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        interviewRepository.delete(interview);
    }

    private InterviewResponse toResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setInterviewDate(interview.getInterviewDate());
        response.setRound(interview.getRound());
        response.setType(interview.getType());
        response.setNotes(interview.getNotes());
        return response;
    }
}
