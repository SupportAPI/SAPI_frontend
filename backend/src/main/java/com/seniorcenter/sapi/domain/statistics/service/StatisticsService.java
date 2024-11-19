package com.seniorcenter.sapi.domain.statistics.service;

import java.time.LocalDate;
import java.util.UUID;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.DashboardResponseDto;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.StatisticsRangeResponseDto;

public interface StatisticsService {

	void updateStatistics(UUID specificationId);
	DashboardResponseDto getDashboardData(UUID workspaceId);
	StatisticsRangeResponseDto getStatisticsByDateRange(UUID workspaceId, LocalDate startDate, LocalDate endDate);
}
