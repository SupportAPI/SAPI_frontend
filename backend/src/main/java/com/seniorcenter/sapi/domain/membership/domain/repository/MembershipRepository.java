package com.seniorcenter.sapi.domain.membership.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.seniorcenter.sapi.domain.membership.domain.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

	@Query("SELECT m FROM Membership m JOIN FETCH m.workspace WHERE m.user.id = :userId AND m.inviteStatus = 'ACCEPTED'")
	List<Membership> findMembershipsWithWorkspacesByUserId(@Param("userId") Long userId);

	Optional<Membership> findByUserIdAndWorkspaceId(Long userId, UUID workspaceId);

	@Query("SELECT m FROM Membership m JOIN FETCH m.user WHERE m.workspace.id = :workspaceId AND m.inviteStatus = 'ACCEPTED'")
	List<Membership> findMembershipsWithUsersByWorkspaceId(@Param("workspaceId") UUID workspaceId);

	@Query("SELECT m FROM Membership m JOIN FETCH m.workspace WHERE m.user.id = :userId AND m.inviteStatus = 'PENDING'")
	List<Membership> findPendingMembershipsWithWorkspacesByUserId(@Param("userId") Long userId);
}
