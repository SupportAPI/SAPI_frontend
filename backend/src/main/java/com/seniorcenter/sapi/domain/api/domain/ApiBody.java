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

    @Column(nullable = false)
    private Boolean isEssential;

    @Column(nullable = false)
    private Boolean isChecked;

    @Builder
    public ApiBody(Api api, ParameterType parameterType, String bodyKey, String bodyValue, String description, Boolean isEssential, Boolean isChecked) {
        this.api = api;
        this.parameterType = parameterType;
        this.bodyKey = bodyKey;
        this.bodyValue = bodyValue;
        this.description = description;
        this.isEssential = isEssential;
        this.isChecked = isChecked;
    }

    public static ApiBody createApiBody(Api api, ParameterType parameterType) {
        return ApiBody.builder()
                .api(api)
                .parameterType(parameterType)
                .bodyKey("")
                .bodyValue("")
                .description("")
                .isEssential(true)
                .isChecked(true)
                .build();
    }

    public static ApiBody copyBody(Api api, ApiBody originBody) {
        return ApiBody.builder()
                .api(api)
                .parameterType(originBody.getParameterType())
                .bodyKey(originBody.getBodyKey())
                .bodyValue(originBody.getBodyValue())
                .description(originBody.getDescription())
                .isEssential(originBody.getIsEssential())
                .isChecked(originBody.getIsChecked())
                .build();
    }

    public void updateBodyValue(String bodyValue, Boolean isChecked) {
        this.bodyValue = bodyValue;
        this.isChecked = isChecked;
    }

    public void updateBodyKeyAndValueAndDescription(String bodyKey, String bodyValue, String description) {
        this.bodyKey = bodyKey;
        this.bodyValue = bodyValue;
        this.description = description;
    }
}

