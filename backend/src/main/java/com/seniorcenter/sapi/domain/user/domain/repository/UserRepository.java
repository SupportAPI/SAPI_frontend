package com.seniorcenter.sapi.domain.user.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.seniorcenter.sapi.domain.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	Boolean existsByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.email LIKE %:emailValue% AND u.id NOT IN " +
		"(SELECT m.user.id FROM Membership m WHERE m.workspace.id = :workspaceId)")
	List<User> findUsersNotInWorkspaceWithEmail(@Param("workspaceId") UUID workspaceId, @Param("emailValue") String emailValue, Pageable pageable);

	@Query("SELECT u FROM User u WHERE u.nickname LIKE %:nicknameValue% AND u.id IN " +
		"(SELECT m.user.id FROM Membership m WHERE m.workspace.id = :workspaceId)")
	List<User> findUsersInWorkspaceWithNickname(@Param("workspaceId") UUID workspaceId, @Param("nicknameValue") String nicknameValue, Pageable pageable);

	@Query("SELECT m.user FROM Membership m WHERE m.workspace.id = :workspaceId AND m.inviteStatus = 'PENDING'")
	List<User> findPendingUsersByWorkspaceId(@Param("workspaceId") UUID workspaceId);

	@Query("SELECT m.user FROM Membership m WHERE m.workspace.id = :workspaceId AND m.inviteStatus = 'ACCEPTED'")
	List<User> findAcceptedUsersByWorkspaceId(@Param("workspaceId") UUID workspaceId);
}
