package com.seniorcenter.sapi.domain.specification.presentation.dto.response;

import java.util.List;

public record SpecificationCategoryResponseDto(
        String category,
        List<SpecificationIdNameResponseDto> apis
) {
}
