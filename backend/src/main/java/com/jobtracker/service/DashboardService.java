package com.jobtracker.service;

import com.jobtracker.dto.DashboardStatsResponse;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.User;
import com.jobtracker.repository.JobRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final JobRepository jobRepository;

    public DashboardService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public DashboardStatsResponse getStats(User user) {
        Long userId = user.getId();
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalApplications(jobRepository.countByUserId(userId));
        stats.setApplied(jobRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED));
        stats.setScreening(jobRepository.countByUserIdAndStatus(userId, ApplicationStatus.SCREENING));
        stats.setInterviews(jobRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW));
        stats.setOffers(jobRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER));
        stats.setRejected(jobRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED));
        stats.setWithdrawn(jobRepository.countByUserIdAndStatus(userId, ApplicationStatus.WITHDRAWN));
        return stats;
    }
}
