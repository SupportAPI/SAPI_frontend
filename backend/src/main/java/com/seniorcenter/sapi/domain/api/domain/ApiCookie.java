package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "api_cookies")
public class ApiCookie extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id")
    private Api api;

    private String cookieKey;
    private String cookieValue;
    private String description;

    @Builder
    public ApiCookie(Api api, String cookieKey, String cookieValue, String description) {
        this.api = api;
        this.cookieKey = cookieKey;
        this.cookieValue = cookieValue;
        this.description= description;
    }

    public static ApiCookie createApiCookie(Api api) {
        return ApiCookie.builder()
                .api(api)
                .cookieKey("")
                .cookieValue("")
                .description("")
                .build();
    }

    public static ApiCookie copyApiCookie(Api api, ApiCookie originCookie) {
        return ApiCookie.builder()
                .api(api)
                .cookieKey(originCookie.getCookieKey())
                .cookieValue(originCookie.getCookieValue())
                .description(originCookie.getDescription())
                .build();
    }

    public void updateCookieValue(String cookieValue) {
        this.cookieValue = cookieValue;
    }
}
