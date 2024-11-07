package com.seniorcenter.sapi.domain.statistics.domain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.seniorcenter.sapi.domain.statistics.domain.QStatistics;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.StatisticsDto;

@Repository
public class StatisticsRepositoryCustomImpl implements StatisticsRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public StatisticsRepositoryCustomImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public List<StatisticsDto> findRecentStatisticsByWorkspace(UUID workspaceId, LocalDate startDate) {
		QStatistics statistics = QStatistics.statistics;

		List<StatisticsDto> results = queryFactory
			.select(Projections.constructor(StatisticsDto.class, statistics.date, statistics.successCount))
			.from(statistics)
			.where(
				statistics.workspace.id.eq(workspaceId),
				statistics.date.goe(startDate)
			)
			.fetch();

		return fillMissingDatesWithZero(startDate, results);
	}

	@Override
	public List<StatisticsDto> findRecentStatisticsByWorkspaceAndUser(UUID workspaceId, Long userId, LocalDate startDate) {
		QStatistics statistics = QStatistics.statistics;

		List<StatisticsDto> results = queryFactory
			.select(Projections.constructor(StatisticsDto.class, statistics.date, statistics.successCount))
			.from(statistics)
			.where(
				statistics.workspace.id.eq(workspaceId),
				statistics.userId.eq(userId),
				statistics.date.goe(startDate)
			)
			.fetch();

		return fillMissingDatesWithZero(startDate, results);
	}

	private List<StatisticsDto> fillMissingDatesWithZero(LocalDate startDate, List<StatisticsDto> results) {
		LocalDate today = LocalDate.now();

		List<LocalDate> allDates = Stream.iterate(startDate, date -> date.plusDays(1))
			.limit(today.toEpochDay() - startDate.toEpochDay() + 1)
			.collect(Collectors.toList());

		Map<LocalDate, Integer> resultMap = results.stream()
			.collect(Collectors.toMap(StatisticsDto::getDate, StatisticsDto::getSuccessCount));

		return allDates.stream()
			.map(date -> new StatisticsDto(date, resultMap.getOrDefault(date, 0)))
			.collect(Collectors.toList());
	}
}
