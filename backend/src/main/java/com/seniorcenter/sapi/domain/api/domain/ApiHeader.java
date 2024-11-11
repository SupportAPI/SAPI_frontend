package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "api_headers")
public class ApiHeader extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id")
    private Api api;

    private String headerKey;
    private String headerValue;
    private String description;

    @Builder
    public ApiHeader(Api api, String headerKey, String headerValue, String description) {
        this.api = api;
        this.headerKey = headerKey;
        this.headerValue = headerValue;
        this.description = description;
    }

    public static ApiHeader createApiHeader(Api api) {
        return ApiHeader.builder()
                .api(api)
                .headerKey("")
                .headerValue("")
                .description("")
                .build();
    }

    public static ApiHeader copyApiHeader(Api api, ApiHeader originHeader) {
        return ApiHeader.builder()
                .api(api)
                .headerKey(originHeader.getHeaderKey())
                .headerValue(originHeader.getHeaderValue())
                .description(originHeader.getDescription())
                .build();
    }

    public void updateApiHeaderValue(String headerValue) {
        this.headerValue = headerValue;
    }

    public void updateApiHeaderKeyAndValue(String headerKey, String headerValue) {
        this.headerKey = headerKey;
        this.headerValue = headerValue;
    }
}


