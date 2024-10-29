package com.seniorcenter.sapi.domain.membership.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.seniorcenter.sapi.domain.membership.domain.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

	@Query("SELECT m FROM Membership m JOIN FETCH m.workspace WHERE m.user.id = :userId")
	List<Membership> findMembershipsWithWorkspacesByUserId(@Param("userId") Long userId);
	Membership findByUserIdAndWorkspaceId(Long userId, UUID workspaceId);
}
