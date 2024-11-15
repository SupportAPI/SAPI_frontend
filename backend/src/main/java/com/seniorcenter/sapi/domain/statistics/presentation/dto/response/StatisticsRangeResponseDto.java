package com.seniorcenter.sapi.domain.statistics.presentation.dto.response;

import java.util.List;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.StatisticsDto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatisticsRangeResponseDto {

	private List<StatisticsDto> statistics;
	private List<StatisticsDto> userStatistics;
}
