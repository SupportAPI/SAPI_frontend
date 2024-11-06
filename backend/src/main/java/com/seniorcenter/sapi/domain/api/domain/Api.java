package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Api extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "api_id")
    private UUID id;

    private String name;

    private String path;

    @Enumerated(EnumType.STRING)
    private HttpMethod method;

    private String description;

    @Enumerated(EnumType.STRING)
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    private AuthenticationType authenticationType;

    private String category;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "specification_id")
    private Specification specification;

    @Builder
    public Api(Specification specification) {
        this.name = "New API";
        this.path = "";
        this.method = HttpMethod.GET;
        this.bodyType = BodyType.NONE;
        this.authenticationType = AuthenticationType.NOAUTH;
        this.category = "Uncategorized";
        this.description = "";
        this.specification = specification;
    }

    public static Api createApi(){
        return builder()
                .build();
    }

    public void updateApi(Api api) {
        this.name = api.getName();
        this.path = api.getPath();
        this.method = api.getMethod();
        this.bodyType = api.getBodyType();
        this.authenticationType = api.getAuthenticationType();
        this.category = api.getCategory();
    }

    public void updateSpecification(Specification specification) {
        this.specification = specification;
    }

}
