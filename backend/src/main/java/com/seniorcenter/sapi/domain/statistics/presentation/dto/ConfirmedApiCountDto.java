package com.seniorcenter.sapi.domain.statistics.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConfirmedApiCountDto {
	private Long managerId;
	private Long count;
}
