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

    @Enumerated(EnumType.STRING)
    private BodyType bodyType;

    private String bodyData;

    private String description;

    @Builder
    public ApiResponse(Api api, int code, BodyType bodyType, String bodyData, String description) {
        this.api = api;
        this.code = code;
        this.bodyType = bodyType;
        this.bodyData = bodyData;
        this.description = description;
    }

    public static ApiResponse createApiResponse(Api api, int code) {
        return ApiResponse.builder()
                .api(api)
                .code(code)
                .bodyType(BodyType.NONE)
                .bodyData("")
                .description("")
                .build();
    }

    public static ApiResponse copyApiResponse(Api api, ApiResponse originResponse) {
        return ApiResponse.builder()
                .api(api)
                .code(originResponse.getCode())
                .bodyType(originResponse.getBodyType())
                .bodyData(originResponse.getBodyData())
                .description(originResponse.getDescription())
                .build();
    }
}
