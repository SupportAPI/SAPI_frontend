package com.seniorcenter.sapi.domain.membership.presentation;

import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipColorRequestDto;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.membership.presentation.dto.request.CreateMembershipRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipAuthorityRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.request.UpdateMembershipRoleRequestDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.response.InvitedWorkspaceInfoResponseDto;
import com.seniorcenter.sapi.domain.membership.presentation.dto.response.MemberInfoResponseDto;
import com.seniorcenter.sapi.domain.membership.service.MembershipService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

	private final MembershipService membershipService;

	@PostMapping
	public void inviteUser(@RequestBody CreateMembershipRequestDto createMembershipRequestDto) {
		membershipService.createMemberships(createMembershipRequestDto);
	}

	@GetMapping
	public List<MemberInfoResponseDto> getMembershipsAtWorkspace(@RequestParam UUID workspaceId) {
		return membershipService.getMembershipsAtWorkspace(workspaceId);
	}

	@GetMapping("/invited")
	public List<InvitedWorkspaceInfoResponseDto> getInvitedWorkspaces() {
		return membershipService.getInvitedMemberships();
	}

	@GetMapping("/invited-members")
	public List<MemberInfoResponseDto> getPendingUsersInWorkspace(@RequestParam UUID workspaceId) {
		return membershipService.getPendingUsersInWorkspace(workspaceId);
	}

	@PatchMapping("/{membershipId}/accept")
	public void acceptInvite(@PathVariable Long membershipId) {
		membershipService.acceptMembership(membershipId);
	}

	@DeleteMapping("/{membershipId}/refuse")
	public void refuseInvite(@PathVariable Long membershipId) {
		membershipService.refuseMembership(membershipId);
	}

	@PatchMapping("/{membershipId}/role")
	public void updateMembershipRole(@PathVariable Long membershipId,
		@RequestBody UpdateMembershipRoleRequestDto updateMembershipRoleRequestDto) {
		membershipService.updateMembershipRole(updateMembershipRoleRequestDto, membershipId);
	}

	@PatchMapping("/{membershipId}/authority")
	public void updateMembershipAuthority(@PathVariable Long membershipId,
		@RequestBody UpdateMembershipAuthorityRequestDto updateMembershipAuthorityRequestDto) {
		membershipService.updateMembershipAuthority(updateMembershipAuthorityRequestDto, membershipId);
	}

	@PatchMapping("/{membershipId}/color")
	public void updateMembershipColor(@PathVariable Long membershipId,
									  @RequestBody UpdateMembershipColorRequestDto updateMembershipAuthorityRequestDto) {
		membershipService.updateMembershipColor(updateMembershipAuthorityRequestDto, membershipId);
	}

	@DeleteMapping("/resign")
	public void resign(@RequestParam UUID workspaceId) {
		membershipService.resign(workspaceId);
	}

	@DeleteMapping("/exile")
	public void exile(Long userId, UUID workspaceId) {
		membershipService.exile(userId, workspaceId);
	}
}
