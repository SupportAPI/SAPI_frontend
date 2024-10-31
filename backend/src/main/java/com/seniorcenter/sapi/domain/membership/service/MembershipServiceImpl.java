package com.seniorcenter.sapi.domain.membership.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seniorcenter.sapi.domain.membership.domain.InviteStatus;
import com.seniorcenter.sapi.domain.membership.domain.Membership;
import com.seniorcenter.sapi.domain.membership.domain.Role;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.CreateMembershipRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipAuthorityRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipRoleRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.response.InvitedWorkspaceInfoResponseDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.response.MemberInfoResponseDto;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MembershipServiceImpl implements MembershipService {

	private final MembershipRepository membershipRepository;
	private final WorkspaceRepository workspaceRepository;
	private final UserUtils userUtils;

	@Override
	@Transactional
	public void createMemberships(CreateMembershipRequestDto requestDto) {
		User user = userUtils.getUserFromSecurityContext();
		UUID workspaceId = requestDto.workspaceId();
		Workspace workspace = workspaceRepository.findById(workspaceId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
		Membership maintainerMembership = membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
			.orElseThrow(() -> new MainException(CustomException.ACCESS_DENIED_EXCEPTION));

		if (!maintainerMembership.getRole().getRole().equals(Role.MAINTAINER.getRole())) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		List<Membership> memberships = new ArrayList<>();
		for (Long userId : requestDto.userIds()) {
			if (!user.getId().equals(userId)) {
				throw new MainException(CustomException.NOT_ALLOWED_INVITE_SELF);
			}
			Optional<Membership> existingMembership = membershipRepository.findByUserIdAndWorkspaceId(userId,
				requestDto.workspaceId());
			if (existingMembership.isEmpty()) {
				User invitedUser = userUtils.getUserById(userId);
				Membership membership = Membership.createMembership(invitedUser, workspace, Role.MEMBER,
					InviteStatus.PENDING);
				memberships.add(membership);
			}
		}
		membershipRepository.saveAll(memberships);
	}

	@Override
	@Transactional
	public void acceptMembership(Long membershipId) {
		User user = userUtils.getUserFromSecurityContext();
		Membership membership = membershipRepository.findById(membershipId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_MEMBERSHIP));

		if (!user.getId().equals(membership.getUser().getId())) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		membership.acceptInvite();
	}

	@Override
	@Transactional
	public void refuseMembership(Long membershipId) {
		User user = userUtils.getUserFromSecurityContext();
		Membership membership = membershipRepository.findById(membershipId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_MEMBERSHIP));

		if (!user.getId().equals(membership.getUser().getId())) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		membershipRepository.delete(membership);
	}

	@Override
	@Transactional
	public void updateMembershipRole(UpdateMembershipRoleRequestDto requestDto, Long membershipId) {
		User maintainer = userUtils.getUserFromSecurityContext();
		Membership updatedMembership = membershipRepository.findById(membershipId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_MEMBERSHIP));
		Membership maintainerMembership = membershipRepository.findByUserIdAndWorkspaceId(maintainer.getId(),
				updatedMembership.getWorkspace().getId())
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_MEMBERSHIP));

		if (!maintainerMembership.getRole().equals(Role.MAINTAINER)) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		updatedMembership.updateRole(requestDto.role());
	}

	@Override
	@Transactional
	public void updateMembershipAuthority(UpdateMembershipAuthorityRequestDto requestDto, Long membershipId) {
		User manager = userUtils.getUserFromSecurityContext();
		Membership updatedMembership = membershipRepository.findById(membershipId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_MEMBERSHIP));
		Membership managerMembership = membershipRepository.findByUserIdAndWorkspaceId(manager.getId(),
				updatedMembership.getWorkspace().getId())
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_MEMBERSHIP));

		if ((managerMembership.getRole().equals(Role.MEMBER))) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		updatedMembership.updateAuthority(requestDto.readAuthority(), requestDto.updateAuthority(),
			requestDto.saveAuthority(), requestDto.deleteAuthority());
	}

	@Override
	public List<MemberInfoResponseDto> getMembershipsAtWorkspace(UUID workspaceId) {
		List<Membership> memberships = membershipRepository.findMembershipsWithUsersByWorkspaceId(workspaceId);

		return memberships.stream()
			.map(membership -> new MemberInfoResponseDto(
				membership.getUser().getId(),
				membership.getUser().getEmail(),
				membership.getUser().getNickname(),
				membership.getUser().getProfileImage()
			))
			.collect(Collectors.toList());
	}

	@Override
	public List<InvitedWorkspaceInfoResponseDto> getInvitedMemberships() {
		User user = userUtils.getUserFromSecurityContext();
		List<Membership> pendingMemberships = membershipRepository.findPendingMembershipsWithWorkspacesByUserId(user.getId());

		return pendingMemberships.stream()
			.map(membership -> new InvitedWorkspaceInfoResponseDto(
				membership.getId(),
				membership.getWorkspace().getId(),
				membership.getWorkspace().getProjectName(),
				membership.getWorkspace().getDescription(),
				membership.getWorkspace().getMainImage()
			))
			.collect(Collectors.toList());
	}
}
