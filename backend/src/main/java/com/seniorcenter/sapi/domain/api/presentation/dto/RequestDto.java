package com.seniorcenter.sapi.domain.api.presentation.dto;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.domain.apifile.domain.ApiFile;

import java.util.List;

public record RequestDto(
    BodyType bodyType,
    JsonData json,
    List<FormData> formData
) {
    public record JsonData(
        String id,
        String value
    ) {
    }

    public record FormData(
        String id,
        String key,
        String value,
        String type,
        ApiFileDto file,
        String description,
        Boolean isEssential,
        Boolean isChecked
    ) {
        public record ApiFileDto(
            Long id,
            String fileName
        ) {
            public static ApiFileDto from(ApiFile apiFile) {
                return new ApiFileDto(apiFile.getId(), apiFile.getFileName());
            }
        }
    }
}