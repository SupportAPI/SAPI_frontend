package com.seniorcenter.sapi.domain.statistics.service;

import java.util.UUID;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.DashboardDto;

public interface StatisticsService {

	void updateStatistics(UUID specificationId);
	DashboardDto getDashboardData(UUID workspaceId);
}
