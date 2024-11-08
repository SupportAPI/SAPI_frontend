package com.seniorcenter.sapi.domain.specification.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.seniorcenter.sapi.domain.api.domain.QApi;
import com.seniorcenter.sapi.domain.specification.domain.QSpecification;
import com.seniorcenter.sapi.domain.specification.domain.TestStatus;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.ConfirmedApiCountDto;

@Repository
public class SpecificationRepositoryCustomImpl implements SpecificationRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public SpecificationRepositoryCustomImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;;
	}

	@Override
	public UUID findWorkspaceIdByApiId(UUID apiId) {
		QApi api = QApi.api;
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.workspace.id)
			.from(api)
			.join(api.specification, specification)
			.where(api.id.eq(apiId))
			.fetchOne();
	}

	@Override
	public List<ConfirmedApiCountDto> countConfirmedApiByManager(UUID workspaceId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(Projections.constructor(ConfirmedApiCountDto.class,
				specification.manager.id,
				specification.count()
			))
			.from(specification)
			.where(specification.workspace.id.eq(workspaceId)
				.and(specification.confirmedApiId.isNotNull()))
			.groupBy(specification.manager.id)
			.fetch();
	}

	@Override
	public Long countTotalSpecifications(UUID workspaceId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.count())
			.from(specification)
			.where(specification.workspace.id.eq(workspaceId))
			.fetchOne();
	}

	@Override
	public Long countLocalSuccessSpecifications(UUID workspaceId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.count())
			.from(specification)
			.where(
				specification.workspace.id.eq(workspaceId),
				specification.localStatus.eq(TestStatus.SUCCESS)
			)
			.fetchOne();
	}

	@Override
	public Long countServerSuccessSpecifications(UUID workspaceId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.count())
			.from(specification)
			.where(
				specification.workspace.id.eq(workspaceId),
				specification.serverStatus.eq(TestStatus.SUCCESS)
			)
			.fetchOne();
	}

	@Override
	public Long countTotalSpecificationsByUser(UUID workspaceId, Long userId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.count())
			.from(specification)
			.where(
				specification.workspace.id.eq(workspaceId),
				specification.manager.id.eq(userId)
			)
			.fetchOne();
	}

	@Override
	public Long countLocalSuccessSpecificationsByUser(UUID workspaceId, Long userId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.count())
			.from(specification)
			.where(
				specification.workspace.id.eq(workspaceId),
				specification.manager.id.eq(userId),
				specification.localStatus.eq(TestStatus.SUCCESS)
			)
			.fetchOne();
	}

	@Override
	public Long countServerSuccessSpecificationsByUser(UUID workspaceId, Long userId) {
		QSpecification specification = QSpecification.specification;

		return queryFactory
			.select(specification.count())
			.from(specification)
			.where(
				specification.workspace.id.eq(workspaceId),
				specification.manager.id.eq(userId),
				specification.serverStatus.eq(TestStatus.SUCCESS)
			)
			.fetchOne();
	}
}
