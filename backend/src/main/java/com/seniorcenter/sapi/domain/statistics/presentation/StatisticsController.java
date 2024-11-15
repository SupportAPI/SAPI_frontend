package com.seniorcenter.sapi.domain.statistics.presentation;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.DashboardResponseDto;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.StatisticsRangeResponseDto;
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
	public DashboardResponseDto getDashboardData(@PathVariable UUID workspaceId) {
		return statisticsService.getDashboardData(workspaceId);
	}

	@GetMapping("/workspaces/{workspaceId}/statistics")
	public StatisticsRangeResponseDto getStatisticsByDateRange(
		@PathVariable UUID workspaceId,
		@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
		@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

		return statisticsService.getStatisticsByDateRange(workspaceId, startDate, endDate);
	}
}
