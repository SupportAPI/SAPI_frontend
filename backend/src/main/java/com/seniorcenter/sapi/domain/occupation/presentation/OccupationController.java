package com.seniorcenter.sapi.domain.occupation.presentation;

import com.seniorcenter.sapi.domain.occupation.presentation.dto.OccupationResponseDto;
import com.seniorcenter.sapi.domain.occupation.service.OccupationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OccupationController {

    private final OccupationService occupationService;

    @GetMapping("/workspaces/{workspaceId}/occupations")
    public List<OccupationResponseDto> getOccupations(@PathVariable("workspaceId") UUID workspaceId)
    {
        return occupationService.getOccupations(workspaceId);
    }
}
