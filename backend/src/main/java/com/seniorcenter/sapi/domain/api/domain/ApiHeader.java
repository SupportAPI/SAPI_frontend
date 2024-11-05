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

    public static ApiHeader createApiHeader(Api api, String headerKey, String headerValue, String description) {
        return ApiHeader.builder()
                .api(api)
                .headerKey(headerKey)
                .headerValue(headerValue)
                .description(description)
                .build();
    }
}


