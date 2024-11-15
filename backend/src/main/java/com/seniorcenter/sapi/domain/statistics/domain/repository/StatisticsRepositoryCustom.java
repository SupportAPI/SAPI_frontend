package com.seniorcenter.sapi.domain.statistics.domain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.StatisticsDto;

public interface StatisticsRepositoryCustom {
	List<StatisticsDto> findRecentStatisticsByWorkspace(UUID workspaceId, LocalDate startDate);
	List<StatisticsDto> findRecentStatisticsByWorkspaceAndUser(UUID workspaceId, Long userId, LocalDate startDate);
	List<StatisticsDto> findStatisticsByWorkspaceAndDateRange(UUID workspaceId, LocalDate startDate, LocalDate endDate);
	List<StatisticsDto> findStatisticsByWorkspaceUserAndDateRange(UUID workspaceId, Long userId, LocalDate startDate, LocalDate endDate);
}
