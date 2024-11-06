package com.seniorcenter.sapi.domain.membership.service;

import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.membership.presentation.dto.request.CreateMembershipRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipAuthorityRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipRoleRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.response.InvitedWorkspaceInfoResponseDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.response.MemberInfoResponseDto;

public interface MembershipService {

	void createMemberships(CreateMembershipRequestDto requestDto);
	void acceptMembership(Long membershipId);
	void refuseMembership(Long membershipId);
	void updateMembershipRole(UpdateMembershipRoleRequestDto requestDto, Long membershipId);
	void updateMembershipAuthority(UpdateMembershipAuthorityRequestDto requestDto, Long membershipId);
	List<MemberInfoResponseDto> getMembershipsAtWorkspace(UUID workspaceId);
	List<InvitedWorkspaceInfoResponseDto> getInvitedMemberships();
	void resign(UUID workspaceId);
	void exile(Long userId, UUID workspaceId);
}
