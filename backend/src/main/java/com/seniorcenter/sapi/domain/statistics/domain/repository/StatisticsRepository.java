package com.seniorcenter.sapi.domain.statistics.domain.repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.statistics.domain.Statistics;

public interface StatisticsRepository extends JpaRepository<Statistics, Long>, StatisticsRepositoryCustom {

	Optional<Statistics> findByWorkspaceIdAndUserIdAndDate(UUID workspaceId, Long userId, LocalDate date);
}
