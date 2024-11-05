package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "api_bodies")
public class ApiBody extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id")
    private Api api;

    @Enumerated(EnumType.STRING)
    private ParameterType parameterType;

    private String bodyKey;

    @Column(length = 65535)
    private String bodyValue;
    private String description;

    @Builder
    public ApiBody(Api api, ParameterType parameterType, String bodyKey, String bodyValue, String description) {
        this.api = api;
        this.parameterType = parameterType;
        this.bodyKey = bodyKey;
        this.bodyValue = bodyValue;
        this.description = description;
    }

    public static ApiBody createApiBody(Api api, ParameterType parameterType, String bodyKey, String bodyValue, String description) {
        return ApiBody.builder()
                .api(api)
                .parameterType(parameterType)
                .bodyKey(bodyKey)
                .bodyValue(bodyValue)
                .description(description)
                .build();
    }
}

