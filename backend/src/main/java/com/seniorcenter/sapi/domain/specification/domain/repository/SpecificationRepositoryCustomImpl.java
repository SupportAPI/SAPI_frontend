package com.seniorcenter.sapi.domain.specification.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.seniorcenter.sapi.domain.specification.domain.QSpecification;
import com.seniorcenter.sapi.domain.statistics.presentation.dto.ConfirmedApiCountDto;

import jakarta.persistence.EntityManager;

@Repository
public class SpecificationRepositoryCustomImpl implements SpecificationRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Autowired
	public SpecificationRepositoryCustomImpl(EntityManager entityManager) {
		this.queryFactory = new JPAQueryFactory(entityManager);
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
}
