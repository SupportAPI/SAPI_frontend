package com.seniorcenter.sapi.domain.statistics.presentation.dto.response;

import java.util.List;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.StatisticsDto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponseDto {

	private Long totalSpecifications;
	private Long localSuccessCount;
	private Long serverSuccessCount;

	private Long userTotalSpecifications;
	private Long userLocalSuccessCount;
	private Long userServerSuccessCount;

	private List<StatisticsDto> recentStatistics;
	private List<StatisticsDto> userRecentStatistics;
}
