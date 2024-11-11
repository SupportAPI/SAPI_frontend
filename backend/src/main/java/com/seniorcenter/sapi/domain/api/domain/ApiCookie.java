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

    @Column(nullable = false)
    private Boolean isEssential;

    @Column(nullable = false)
    private Boolean isChecked;

    @Builder
    public ApiCookie(Api api, String cookieKey, String cookieValue, String description, Boolean isEssential, Boolean isChecked) {
        this.api = api;
        this.cookieKey = cookieKey;
        this.cookieValue = cookieValue;
        this.description= description;
        this.isEssential = isEssential;
        this.isChecked = isChecked;
    }

    public static ApiCookie createApiCookie(Api api) {
        return ApiCookie.builder()
                .api(api)
                .cookieKey("")
                .cookieValue("")
                .description("")
                .isEssential(true)
                .isChecked(true)
                .build();
    }

    public static ApiCookie copyApiCookie(Api api, ApiCookie originCookie) {
        return ApiCookie.builder()
                .api(api)
                .cookieKey(originCookie.getCookieKey())
                .cookieValue(originCookie.getCookieValue())
                .description(originCookie.getDescription())
                .isEssential(originCookie.getIsEssential())
                .isChecked(originCookie.getIsChecked())
                .build();
    }

    public void updateCookieValue(String cookieValue, Boolean isChecked) {
        this.cookieValue = cookieValue;
        this.isChecked = isChecked;
    }

    public void updateCookieKeyAndValue(String cookieKey, String cookieValue) {
        this.cookieKey = cookieKey;
        this.cookieValue = cookieValue;
    }
}
