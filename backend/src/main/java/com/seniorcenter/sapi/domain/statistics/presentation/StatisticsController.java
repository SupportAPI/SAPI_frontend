package com.seniorcenter.sapi.domain.statistics.presentation;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.DashboardDto;
import com.seniorcenter.sapi.domain.statistics.service.StatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class StatisticsController {

	private final StatisticsService statisticsService;

	@GetMapping("/workspaces/{workspaceId}/dashboards")
	public DashboardDto getDashboardData(@PathVariable UUID workspaceId) {
		return statisticsService.getDashboardData(workspaceId);
	}
}
