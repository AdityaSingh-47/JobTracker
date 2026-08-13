package com.jobtracker.repository;

import com.jobtracker.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByJobId(Long jobId);

    Optional<Interview> findByIdAndJobUserId(Long id, Long userId);
}
