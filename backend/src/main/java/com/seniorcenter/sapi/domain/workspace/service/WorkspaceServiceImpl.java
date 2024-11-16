package com.seniorcenter.sapi.domain.workspace.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.category.domain.Category;
import com.seniorcenter.sapi.domain.category.domain.repository.CategoryRepository;
import com.seniorcenter.sapi.domain.membership.service.MembershipServiceImpl;
import com.seniorcenter.sapi.global.utils.WebSocketUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.environment.domain.EnvironmentCategory;
import com.seniorcenter.sapi.domain.environment.domain.repository.EnvironmentCategoryRepository;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.membership.domain.InviteStatus;
import com.seniorcenter.sapi.domain.membership.domain.Membership;
import com.seniorcenter.sapi.domain.membership.domain.Role;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.CreateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.UpdateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.response.WorkspaceInfoResponseDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.S3UploadUtil;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class WorkspaceServiceImpl implements WorkspaceService {

	private final UserRepository userRepository;
	private final WorkspaceRepository workSpaceRepository;
	private final MembershipRepository membershipRepository;
	private final UserUtils userUtils;
	private final S3UploadUtil s3UploadUtil;
	private final CategoryRepository categoryRepository;
	private final EnvironmentCategoryRepository environmentCategoryRepository;
	private final MembershipServiceImpl membershipServiceImpl;
	private final WebSocketUtil webSocketUtil;
	private final ApiRepository apiRepository;

	@Override
	@Transactional
	public WorkspaceInfoResponseDto createWorkspace(CreateWorkspaceRequestDto requestDto, MultipartFile mainImage) {
		User user = userUtils.getUserFromSecurityContext();

		String mainImageUrl = mainImage == null || mainImage.isEmpty()
			? "https://sapibucket.s3.ap-northeast-2.amazonaws.com/default_images/basic_image.png"
			: s3UploadUtil.saveFile(mainImage);

		Workspace workspace = Workspace.createWorkspace(requestDto, mainImageUrl);
		workSpaceRepository.save(workspace);

		Membership membership = Membership.createMembership(user, workspace, Role.MAINTAINER, InviteStatus.ACCEPTED, membershipServiceImpl.getColor(workspace.getId()));
		membership.updateAuthorityForMaintainer();
		membershipRepository.save(membership);

		Category category = Category.createCategory("미설정",workspace);
		categoryRepository.save(category);

		CreateEnvironmentCategoryRequestDto environmentCategoryRequestDto =
			new CreateEnvironmentCategoryRequestDto(workspace.getId(), "Local");
		EnvironmentCategory environmentCategory =
			EnvironmentCategory.createEnvironmentCategory(workspace, environmentCategoryRequestDto);
		environmentCategoryRepository.save(environmentCategory);

		return new WorkspaceInfoResponseDto(workspace.getId(),
			workspace.getProjectName(), workspace.getDescription(), workspace.getMainImage(), workspace.getDomain(),
			workspace.getIsCompleted(), 0);
	}

	@Override
	public WorkspaceInfoResponseDto getWorkspace(UUID workspaceId) {
		Workspace workspace = workSpaceRepository.findById(workspaceId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

        log.info("[COUNT CONNECTIONS] " + "/ws/sub/workspaces/"+ workspace.getId() +"/docs : " + webSocketUtil.countUsersSubscribedToDestination("/workspaces/"+ workspace.getId() +"/docs"));
		WorkspaceInfoResponseDto workspaceInfoResponseDto = new WorkspaceInfoResponseDto(workspace.getId(),
			workspace.getProjectName(), workspace.getDescription(), workspace.getMainImage(), workspace.getDomain(),
			workspace.getIsCompleted(), webSocketUtil.countUsersSubscribedToDestination("/ws/sub/workspaces/"+ workspaceId +"/docs"));
		return workspaceInfoResponseDto;
	}

	@Override
	public List<WorkspaceInfoResponseDto> getWorkspaces() {
		User user = userUtils.getUserFromSecurityContext();
		List<Membership> memberships = membershipRepository.findMembershipsWithWorkspacesByUserId(user.getId());

		return memberships.stream()
			.map(membership -> {
				Workspace workspace = membership.getWorkspace();
				log.info("[COUNT CONNECTIONS] " + "/ws/sub/workspaces/"+ workspace.getId() +"/docs : " + webSocketUtil.countUsersSubscribedToDestination("/workspaces/"+ workspace.getId() +"/docs"));
				return new WorkspaceInfoResponseDto(
					workspace.getId(),
					workspace.getProjectName(),
					workspace.getDescription(),
					workspace.getMainImage(),
					workspace.getDomain(),
					workspace.getIsCompleted(),
					webSocketUtil.countUsersSubscribedToDestination("/ws/sub/workspaces/"+ workspace.getId() +"/docs")
				);
			})
			.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void updateWorkspace(UUID workspaceId, UpdateWorkspaceRequestDto requestDto, MultipartFile mainImage) {
		Membership membership = membershipRepository.
			findByUserIdAndWorkspaceId(userUtils.getUserFromSecurityContext().getId(), workspaceId)
			.orElseThrow(() -> new MainException(CustomException.ACCESS_DENIED_EXCEPTION));

		if (!membership.getUpdateAuthority()) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		Workspace workspace = workSpaceRepository.findById(workspaceId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

		String mainImageUrl = "";
		if (mainImage != null && !mainImage.isEmpty()) {
			mainImageUrl = s3UploadUtil.saveFile(mainImage);
		} else {
			mainImageUrl = workspace.getMainImage();
		}

		workspace.updateWorkspace(requestDto, mainImageUrl);
	}

	@Override
	@Transactional
	public void removeWorkspace(UUID workspaceId) {
		Membership membership = membershipRepository.
			findByUserIdAndWorkspaceId(userUtils.getUserFromSecurityContext().getId(), workspaceId)
			.orElseThrow(() -> new MainException(CustomException.ACCESS_DENIED_EXCEPTION));

		if (!membership.getDeleteAuthority()) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		workSpaceRepository.deleteById(workspaceId);
	}
}
