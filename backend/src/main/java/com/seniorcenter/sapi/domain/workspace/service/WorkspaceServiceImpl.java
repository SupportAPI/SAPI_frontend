package com.seniorcenter.sapi.domain.workspace.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.membership.domain.InviteStatus;
import com.seniorcenter.sapi.domain.membership.domain.Membership;
import com.seniorcenter.sapi.domain.membership.domain.Role;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkSpaceRepository;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.CreateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.UpdateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.response.WorkspaceInfoResponseDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.S3UploadUtil;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

	private final UserRepository userRepository;
	private final WorkSpaceRepository workSpaceRepository;
	private final MembershipRepository membershipRepository;
	private final UserUtils userUtils;
	private final S3UploadUtil s3UploadUtil;

	@Override
	@Transactional
	public void createWorkspace(CreateWorkspaceRequestDto requestDto, MultipartFile mainImage) {
		User user = userUtils.getUserFromSecurityContext();
		String mainImageUrl = s3UploadUtil.saveFile(mainImage);

		Workspace workspace = Workspace.createWorkspace(requestDto, mainImageUrl);
		workSpaceRepository.save(workspace);

		Membership membership = Membership.createMembership(user, workspace, Role.MAINTAINER, InviteStatus.ACCEPTED);
		membership.updateAuthorityForMaintainer();
		membershipRepository.save(membership);
	}

	@Override
	public WorkspaceInfoResponseDto getWorkspace(Long workspaceId) {
		Workspace workspace = workSpaceRepository.findById(workspaceId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
		WorkspaceInfoResponseDto workspaceInfoResponseDto = new WorkspaceInfoResponseDto(workspace.getId(),
			workspace.getProjectName(), workspace.getDescription(), workspace.getMainImage(), workspace.getDomain(),
			workspace.getUuid());
		return workspaceInfoResponseDto;
	}

	@Override
	public List<WorkspaceInfoResponseDto> getWorkspaces() {
		User user = userUtils.getUserFromSecurityContext();
		List<Membership> memberships = membershipRepository.findMembershipsWithWorkspacesByUserId(user.getId());

		return memberships.stream()
			.map(membership -> {
				Workspace workspace = membership.getWorkspace();
				return new WorkspaceInfoResponseDto(
					workspace.getId(),
					workspace.getProjectName(),
					workspace.getDescription(),
					workspace.getMainImage(),
					workspace.getDomain(),
					workspace.getUuid()
				);
			})
			.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void updateWorkspace(Long workspaceId, UpdateWorkspaceRequestDto requestDto, MultipartFile mainImage) {
		Membership membership = membershipRepository.
			findByUserIdAndWorkspaceId(userUtils.getUserFromSecurityContext().getId(), workspaceId);

		if (!membership.getUpdateAuthority()) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		Workspace workspace = workSpaceRepository.findById(workspaceId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
		String mainImageUrl = s3UploadUtil.saveFile(mainImage);

		workspace.updateWorkspace(requestDto, mainImageUrl);
	}

	@Override
	@Transactional
	public void removeWorkspace(Long workspaceId) {
		Membership membership = membershipRepository.
			findByUserIdAndWorkspaceId(userUtils.getUserFromSecurityContext().getId(), workspaceId);

		if (!membership.getDeleteAuthority()) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		workSpaceRepository.deleteById(workspaceId);
	}
}
