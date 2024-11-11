package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "api_query_parameters")
public class ApiQueryParameter extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id")
    private Api api;

    private String paramKey;
    private String paramValue;
    private String description;

    @Column(nullable = false)
    private Boolean isEssential;

    @Column(nullable = false)
    private Boolean isChecked;

    @Builder
    public ApiQueryParameter(Api api, String paramKey, String paramValue, String description, Boolean isEssential, Boolean isChecked) {
        this.api = api;
        this.paramKey = paramKey;
        this.paramValue = paramValue;
        this.description = description;
        this.isEssential = isEssential;
        this.isChecked = isChecked;
    }

    public static ApiQueryParameter createApiQueryParameter(Api api) {
        return ApiQueryParameter.builder()
                .api(api)
                .paramKey("")
                .paramValue("")
                .description("")
                .isEssential(true)
                .isChecked(true)
                .build();
    }

    public static ApiQueryParameter copyApiQueryParameter(Api api, ApiQueryParameter originQueryParameter) {
        return ApiQueryParameter.builder()
                .api(api)
                .paramKey(originQueryParameter.getParamKey())
                .paramValue(originQueryParameter.getParamValue())
                .description(originQueryParameter.getDescription())
                .isEssential(originQueryParameter.getIsEssential())
                .isChecked(originQueryParameter.getIsChecked())
                .build();
    }

    public void updateApiQueryParameterValue(String paramValue, Boolean isChecked) {
        this.paramValue = paramValue;
        this.isChecked = isChecked;
    }
}
