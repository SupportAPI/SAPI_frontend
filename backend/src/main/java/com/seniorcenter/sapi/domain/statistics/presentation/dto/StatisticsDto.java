package com.seniorcenter.sapi.domain.statistics.presentation.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatisticsDto {

	private LocalDate date;
	private Integer successCount;
}
