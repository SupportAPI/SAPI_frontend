package com.seniorcenter.sapi.domain.api.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.seniorcenter.sapi.domain.api.domain.QApi;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.specification.domain.QSpecification;
import com.seniorcenter.sapi.domain.user.domain.QUser;

@Repository
public class ApiRepositoryCustomImpl implements ApiRepositoryCustom{

	private final JPAQueryFactory queryFactory;

	public ApiRepositoryCustomImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public List<ApiTestResponseDto> findConfirmedApisByWorkspaceId(UUID workspaceId) {
		QSpecification specification = QSpecification.specification;
		QApi api = QApi.api;
		QUser user = QUser.user;

		return queryFactory.select(Projections.constructor(
				ApiTestResponseDto.class,
                specification.id.as("docId"),
                api.id.as("apiId"),
				api.category,
				api.name,
				api.method,
				api.path,
				api.description,
				user.nickname.as("managerName"),
				specification.localStatus,
				specification.serverStatus
			))
			.from(specification)
			.leftJoin(specification.manager, user)
			.join(specification.apis, api)
			.where(specification.workspace.id.eq(workspaceId)
				.and(api.id.eq(specification.confirmedApiId)))
			.fetch();
	}
}
