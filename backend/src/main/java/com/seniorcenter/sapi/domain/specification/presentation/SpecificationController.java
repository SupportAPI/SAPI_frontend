package com.seniorcenter.sapi.domain.specification.presentation;

import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationCategoryResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationResponseDto;
import com.seniorcenter.sapi.domain.specification.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class SpecificationController {

    private final SpecificationService specificationService;

    @GetMapping("/workspaces/{workspaceId}/specification")
    public List<SpecificationResponseDto> getSpecifications(@PathVariable("workspaceId") UUID workspaceUUID) {
        return specificationService.getSpecificationsByWorkspaceId(workspaceUUID);
    }

    @GetMapping("/workspaces/{workspaceId}/specification/nav")
    public List<SpecificationCategoryResponseDto> getSpecificationIdNames(@PathVariable("workspaceId") UUID workspaceUUID) {
        return specificationService.getSpecificationsIdAndNamesByWorkspaceId(workspaceUUID);
    }

    @PostMapping("/workspaces/{workspaceId}/specification")
    public UUID createSpecification(@PathVariable("workspaceId") UUID workspaceUUID) {
        return specificationService.createSpecificationByApi(workspaceUUID);
    }

    @DeleteMapping("/specification/{specificationId}")
    public void deleteSpecification(@PathVariable("specificationId") UUID specificationUUID) {
        specificationService.removeSpecificationByApi(specificationUUID);
    }

}
