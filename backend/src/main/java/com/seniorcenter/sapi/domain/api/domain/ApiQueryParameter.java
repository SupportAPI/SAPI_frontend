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

    @Builder
    public ApiQueryParameter(Api api) {
        this.api = api;
        this.paramKey = "";
        this.paramValue = "";
        this.description = "";
    }

    public static ApiQueryParameter createApiQueryParameter(Api api) {
        return ApiQueryParameter.builder()
                .api(api)
                .build();
    }
}
