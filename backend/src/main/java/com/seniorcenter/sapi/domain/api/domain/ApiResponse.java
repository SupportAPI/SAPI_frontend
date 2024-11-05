package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "api_responses")
public class ApiResponse extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id")
    private Api api;

    private int code;
    private String description;

    @Enumerated(EnumType.STRING)
    private BodyType bodyType;

    private String bodyData;

    @Builder
    public ApiResponse(Api api, int code) {
        this.api = api;
        this.code = code;
        this.description = "";
        this.bodyType = BodyType.JSON;
        this.bodyData = "";
    }

    public static ApiResponse createApiResponse(Api api, int code) {
        return ApiResponse.builder()
                .api(api)
                .code(code)
                .build();
    }
}
