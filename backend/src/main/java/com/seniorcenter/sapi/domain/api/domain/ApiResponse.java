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

    private String name;

    @Enumerated(EnumType.STRING)
    private BodyType bodyType;

    private String bodyData;

    private String description;

    @Builder
    public ApiResponse(Api api, int code, String name, BodyType bodyType, String bodyData, String description) {
        this.api = api;
        this.code = code;
        this.name = name;
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
            .name(originResponse.getName())
            .bodyType(originResponse.getBodyType())
            .bodyData(originResponse.getBodyData())
            .description(originResponse.getDescription())
            .build();
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateBodyTypeAndBodyData(String bodyType, String bodyData) {
        this.bodyType = BodyType.valueOf(bodyType);
        this.bodyData = bodyData;
    }
}
