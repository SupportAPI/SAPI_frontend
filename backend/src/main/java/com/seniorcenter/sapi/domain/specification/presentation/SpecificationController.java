package com.seniorcenter.sapi.domain.specification.presentation;

import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.service.ApiService;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationCategoryResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationHistoryListResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationResponseDto;
import com.seniorcenter.sapi.domain.specification.service.SpecificationService;
import com.seniorcenter.sapi.global.annotation.ExcludeFromAdvice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class SpecificationController {

    private final SpecificationService specificationService;
    private final ApiService apiService;

    @GetMapping("/workspaces/{workspaceId}/docs")
    public List<SpecificationResponseDto> getSpecifications(@PathVariable("workspaceId") UUID workspaceUUID) {
        return specificationService.getSpecificationsByWorkspaceId(workspaceUUID);
    }

    @GetMapping("/workspaces/{workspaceId}/docs/nav")
    public List<SpecificationCategoryResponseDto> getSpecificationIdNames(@PathVariable("workspaceId") UUID workspaceUUID) {
        return specificationService.getSpecificationsIdAndNamesByWorkspaceId(workspaceUUID);
    }

    @PostMapping("/workspaces/{workspaceId}/docs")
    public UUID createSpecification(@PathVariable("workspaceId") UUID workspaceUUID) {
        return specificationService.createSpecificationByApi(workspaceUUID);
    }

    @DeleteMapping("/workspaces/{workspaceId}/docs/{docsId}")
    public void deleteSpecification(@PathVariable("docsId") UUID docUUID) {
        specificationService.removeSpecificationByApi(docUUID);
    }

    @PostMapping("/workspaces/{workspaceId}/docs/{docsId}/confirm")
    public SpecificationResponseDto specificationConfirm(@PathVariable("docsId") UUID docUUID) {
        return specificationService.confirmSpecificationApiId(docUUID);
    }

    @GetMapping("/workspaces/{workspaceId}/docs/{docsId}/history")
    public List<ApiResponseDto> getHistory(@PathVariable("docsId") UUID docUUID){
        return apiService.getApiHistoryBySpecificationId(docUUID);
    }

    @GetMapping("/workspaces/{workspaceId}/docs/{docsID}/history-list")
    public List<SpecificationHistoryListResponseDto> getHistoryList(@PathVariable("docsID") UUID docUUID){
        return apiService.getApiHistoryListBySpecificationId(docUUID);
    }

    @ExcludeFromAdvice
    @PostMapping("/workspaces/{workspaceId}/docs/{specificationId}/export")
    public ResponseEntity<byte[]> exportFile(
        @PathVariable("workspaceId") UUID workspaceId,
        @PathVariable("specificationId") UUID specificationId,
        @RequestParam("ext") String ext
    ) {
        byte[] fileBytes = specificationService.exportFile(workspaceId, specificationId, ext);
        return new ResponseEntity<>(fileBytes, HttpStatus.OK);
    }


    @ExcludeFromAdvice
    @PostMapping("/workspaces/{workspaceId}/export")
    public ResponseEntity<byte[]> exportPdf(
        @PathVariable("workspaceId") UUID workspaceId,
        @RequestParam("specifications") List<UUID> specifications,
        @RequestParam("ext") String ext
    ) {
        byte[] zipBytes = specificationService.exportFiles(workspaceId, specifications, ext);
        return new ResponseEntity<>(zipBytes, HttpStatus.OK);
    }
}
