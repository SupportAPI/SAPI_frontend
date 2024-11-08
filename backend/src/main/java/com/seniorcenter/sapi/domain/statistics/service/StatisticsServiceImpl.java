package com.seniorcenter.sapi.domain.statistics.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.statistics.domain.Statistics;
import com.seniorcenter.sapi.domain.statistics.domain.repository.StatisticsRepository;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.ConfirmedApiCountDto;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.StatisticsDto;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.response.DashboardDto;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

	private final StatisticsRepository statisticsRepository;
	private final SpecificationRepository specificationRepository;
	private final UserUtils userUtils;

	@Override
	public void updateStatistics(UUID specificationId) {
		Specification specification = specificationRepository.findById(specificationId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

		List<ConfirmedApiCountDto> confirmedApiCounts = specificationRepository.countConfirmedApiByManager(specification.getWorkspace().getId());

		LocalDate today = LocalDate.now();

		for (ConfirmedApiCountDto dto : confirmedApiCounts) {
			Long managerId = dto.getManagerId();
			Integer count = dto.getCount().intValue();

			Statistics statistics = statisticsRepository.findByWorkspaceIdAndUserIdAndDate(
					specification.getWorkspace().getId(), managerId, today)
				.orElse(null);

			if (statistics == null) {
				statisticsRepository.save(Statistics.createStatistics(
					specification.getWorkspace(), managerId, today, count));
			} else {
				statistics.updateSuccessCount(count);
			}
		}
	}

	@Override
	public DashboardDto getDashboardData(UUID workspaceId) {
		User user = userUtils.getUserFromSecurityContext();
		Long userId = user.getId();

		Long totalSpecifications = specificationRepository.countTotalSpecifications(workspaceId);
		Long localSuccessCount = specificationRepository.countLocalSuccessSpecifications(workspaceId);
		Long serverSuccessCount = specificationRepository.countServerSuccessSpecifications(workspaceId);

		Long userTotalSpecifications = specificationRepository.countTotalSpecificationsByUser(workspaceId, userId);
		Long userLocalSuccessCount = specificationRepository.countLocalSuccessSpecificationsByUser(workspaceId, userId);
		Long userServerSuccessCount = specificationRepository.countServerSuccessSpecificationsByUser(workspaceId, userId);

		LocalDate startDate = LocalDate.now().minusDays(30);
		List<StatisticsDto> recentStatistics = statisticsRepository.findRecentStatisticsByWorkspace(workspaceId, startDate);
		List<StatisticsDto> userRecentStatistics = statisticsRepository.findRecentStatisticsByWorkspaceAndUser(workspaceId, userId, startDate);

		return new DashboardDto(totalSpecifications, localSuccessCount, serverSuccessCount,
			userTotalSpecifications, userLocalSuccessCount, userServerSuccessCount,
			recentStatistics, userRecentStatistics);
	}
}
