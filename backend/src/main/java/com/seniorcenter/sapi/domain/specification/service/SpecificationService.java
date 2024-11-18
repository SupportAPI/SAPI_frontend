package com.seniorcenter.sapi.domain.specification.service;

import com.seniorcenter.sapi.domain.api.domain.*;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.*;
import com.seniorcenter.sapi.domain.api.presentation.dto.ApiDto;
import com.seniorcenter.sapi.domain.category.domain.repository.CategoryRepository;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.notification.domain.NotificationType;
import com.seniorcenter.sapi.domain.notification.util.SseUtils;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.SpecificationMessage;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationCategoryResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationIdNameResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationResponseDto;
import com.seniorcenter.sapi.domain.statistics.service.StatisticsService;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.aws.ApiLambdaService;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.ExportUtil;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpecificationService {

    private final SpecificationRepository specificationRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final WorkspaceRepository workspaceRepository;
    private final ApiRepository apiRepository;
    private final UserUtils userUtils;
    private final ApiLambdaService apiLambdaService;
    private final ApiBodyRepository apiBodyRepository;
    private final ApiCookieRepository apiCookieRepository;
    private final ApiHeaderRepository apiHeaderRepository;
    private final ApiQueryParameterRepository apiQueryParameterRepository;
    private final ApiPathVariableRepository apiPathVariableRepository;
    private final ApiResponseRepository apiResponseRepository;
    private final StatisticsService statisticsService;
    private final SseUtils sseUtils;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final ExportUtil exportUtil;

    @Transactional
    public void createSpecification(SpecificationMessage message, UUID worksapceId, Principal principal) {
        Api api = Api.createApi();
        apiRepository.save(api);

        ApiBody jsonBody = ApiBody.createApiBody(api, ParameterType.JSON);
        apiBodyRepository.save(jsonBody);

        Workspace workspace = workspaceRepository.findById(worksapceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

        Specification specification = Specification.createSpecification(workspace);
        api.updateSpecification(specification);
        specificationRepository.save(specification);
        sendOriginMessageToAll(message, worksapceId);
    }

    @Transactional
    public void removeSpecification(SpecificationMessage message, UUID worksapceId, Principal principal) {
        UUID specificationId = UUID.fromString((String) message.message());
        Specification specification = specificationRepository.findById(specificationId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        if (specification == null) {
            sendErrorMessageToUser("존재하지 않는 API 명세 UUID입니다.", worksapceId);
        } else {
            specificationRepository.delete(specification);
            sendOriginMessageToAll(message, worksapceId);
        }
    }

    @Transactional
    public void updateSpecification(SpecificationMessage message, UUID worksapceId, Principal principal) {

    }

    @Transactional
    public List<SpecificationResponseDto> getSpecificationsByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);
        return specifications.stream()
            .map(specification -> {
                Api api = apiRepository.findTopBySpecificationIdOrderByCreatedDateDesc(specification.getId())
                    .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
                return new SpecificationResponseDto(api, specification);
            }).collect(Collectors.toList());
    }

    @Transactional
    public List<SpecificationCategoryResponseDto> getSpecificationsIdAndNamesByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);

        Map<String, Integer> categoryMap = new HashMap<>();
        AtomicInteger categoryIndex = new AtomicInteger();
        List<SpecificationCategoryResponseDto> categoryResponseDtos = new ArrayList<>();
        specifications.stream()
            .map(specification -> {
                Api api = apiRepository.findTopBySpecificationIdOrderByCreatedDateDesc(specification.getId())
                    .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
                if (!categoryMap.containsKey(api.getCategory())) {
                    categoryMap.put(api.getCategory(), categoryIndex.incrementAndGet() - 1);
                    categoryResponseDtos.add(new SpecificationCategoryResponseDto(api.getCategory(), new ArrayList<>()));
                }
                categoryResponseDtos.get(categoryMap.get(api.getCategory()))
                    .apis().add(new SpecificationIdNameResponseDto(api.getId(), specification.getId(), api.getName()));
                return new SpecificationIdNameResponseDto(api.getId(), specification.getId(), api.getName());
            }).collect(Collectors.toList());

        return categoryResponseDtos;
    }

    public void sendErrorMessageToUser(String errorMessage, UUID workspaceUUID) {
        User user = userUtils.getUserFromSecurityContext();
        if (user != null) {
            messagingTemplate.convertAndSendToUser(
                String.valueOf(user.getId()),
                "/ws/sub/workspaces/" + workspaceUUID + "/docs/errors",
                errorMessage
            );
        }
    }

    public void sendOriginMessageToAll(SpecificationMessage message, UUID worksapceUUId) {
        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + worksapceUUId + "/docs", message);
    }

    @Transactional
    public UUID createSpecificationByApi(UUID workspaceId) {
        Api api = Api.createApi();
        apiRepository.save(api);
        Workspace workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

        Specification specification = Specification.createSpecification(workspace);
        api.updateSpecification(specification);
        specificationRepository.save(specification);
        return specification.getId();
    }

    @Transactional
    public void removeSpecificationByApi(UUID specificationId) {
        Specification specification = specificationRepository.findById(specificationId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        specificationRepository.delete(specification);
    }

    @Transactional
    public SpecificationResponseDto confirmSpecificationApiId(UUID specificationId) {
        User user = userUtils.getUserFromSecurityContext();
        Specification specification = specificationRepository.findById(specificationId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        Api originApi = apiRepository.findTopBySpecificationIdOrderByCreatedDateDesc(specificationId).orElseThrow();
        specification.updateConfirmedApiId(originApi.getId(), user.getId());

        List<ApiPathVariable> pathVariables = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\{([^}]+)\\}");
        Matcher matcher = pattern.matcher(originApi.getPath());

        while (matcher.find()) {
            pathVariables.add(ApiPathVariable.createApiPathVariable(originApi, matcher.group(1)));
        }
        apiPathVariableRepository.saveAll(pathVariables);

        Api newApi = Api.createApi();
        apiRepository.save(newApi);
        newApi.updateSpecification(specification);
        newApi.updateApi(originApi);

        List<ApiHeader> newHeaders = originApi.getHeaders().stream()
            .map(header -> ApiHeader.copyApiHeader(newApi, header))
            .collect(Collectors.toList());
        apiHeaderRepository.saveAll(newHeaders);

        List<ApiCookie> newCookies = originApi.getCookies().stream()
            .map(cookie -> ApiCookie.copyApiCookie(newApi, cookie))
            .collect(Collectors.toList());
        apiCookieRepository.saveAll(newCookies);

        List<ApiQueryParameter> newQueryParameter = originApi.getQueryParameters().stream()
            .map(queryParameter -> ApiQueryParameter.copyApiQueryParameter(newApi, queryParameter))
            .collect(Collectors.toList());
        apiQueryParameterRepository.saveAll(newQueryParameter);

        List<ApiBody> newBodies = originApi.getBodies().stream()
            .map(body -> ApiBody.copyBody(newApi, body))
            .collect(Collectors.toList());
        apiBodyRepository.saveAll(newBodies);

        List<ApiResponse> newResponses = originApi.getResponses().stream()
            .map(response -> ApiResponse.copyApiResponse(newApi, response))
            .collect(Collectors.toList());
        apiResponseRepository.saveAll(newResponses);

        apiLambdaService.createLambda(specificationId);

        statisticsService.updateStatistics(specificationId);

        if (specification.getManager() != null) {
            sseUtils.sendApiNotification(specification.getManager(), originApi.getId(),
                specification.getWorkspace().getId(), NotificationType.API_CONFIRM);
        }

        List<User> usersInWorkspace = userRepository
            .findAcceptedUsersByWorkspaceId(specification.getWorkspace().getId());
        for (User users : usersInWorkspace) {
            sseUtils.send(users, originApi.getId(), specification.getWorkspace().getId(), NotificationType.API_CONFIRM);
        }

        originApi.confirm(user.getId(), LocalDateTime.now());

        return new SpecificationResponseDto(originApi, specification);
    }

    public byte[] exportFile(UUID workspaceId, UUID specificationId, String ext) {
        User user = userUtils.getUserFromSecurityContext();

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        Specification specification = specificationRepository.findById(specificationId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Api api = apiRepository.findById(specification.getConfirmedApiId())
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        return generateFile(api, ext);
    }

    public byte[] exportFiles(UUID workspaceId, List<UUID> specifications, String ext) {
        User user = userUtils.getUserFromSecurityContext();

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        try {
            ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();
            try (ZipOutputStream zipStream = new ZipOutputStream(zipOutputStream)) {
                for (UUID specificationId : specifications) {
                    Specification specification = specificationRepository.findById(specificationId)
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

                    Api api = apiRepository.findById(specification.getConfirmedApiId())
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

                    byte[] fileBytes = generateFile(api, ext);

                    String fileName = String.format("%s %s.%s", api.getName(), specificationId, ext.toLowerCase());

                    ZipEntry zipEntry = new ZipEntry(fileName);
                    zipEntry.setSize(fileBytes.length);
                    zipStream.putNextEntry(zipEntry);
                    zipStream.write(fileBytes);
                    zipStream.closeEntry();
                }
            }
            return zipOutputStream.toByteArray();
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            throw new MainException(CustomException.FILE_PROCESSING_EXCEPTION);
        }
    }

    private byte[] generateFile(Api api, String ext) {
        // 컨텍스트 생성 및 파일 생성
        Context context;
        if (ext.equalsIgnoreCase("PDF")) {
            context = exportUtil.generatorHtmlContent(ApiDto.createApiDto(api));
            return exportUtil.generatePdf(context);
        } else if (ext.equalsIgnoreCase("HTML")) {
            context = exportUtil.generatorHtmlContent(ApiDto.createApiDto(api));
            return exportUtil.generateHtml(context);
        } else if (ext.equalsIgnoreCase("MARKDOWN")) {
            context = exportUtil.generatorContent(ApiDto.createApiDto(api));
            return exportUtil.generateMarkdown(context);
        } else {
            throw new MainException(CustomException.INVALID_FILE_EXTENSION);
        }
    }
}
