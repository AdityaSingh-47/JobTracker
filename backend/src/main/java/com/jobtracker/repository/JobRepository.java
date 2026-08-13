package com.jobtracker.repository;

import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByUserId(Long userId);

    Optional<Job> findByIdAndUserId(Long id, Long userId);

    List<Job> findByUserIdAndStatus(Long userId, ApplicationStatus status);

    @Query("SELECT j FROM Job j WHERE j.user.id = :userId AND " +
           "(LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchByUserIdAndKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);
}
