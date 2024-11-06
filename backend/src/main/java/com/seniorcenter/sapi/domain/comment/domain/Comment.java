package com.seniorcenter.sapi.domain.comment.domain;

import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    private String comment;

    private Long writerId;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "specification_id")
    private Specification specification;

    @Builder
    public Comment(String comment, Long writerId, Specification specification) {
        this.comment = comment;
        this.writerId = writerId;
        this.specification = specification;
    }

    public static Comment createComment(String comment, Long writerId, Specification specification) {
        return builder()
                .comment(comment)
                .writerId(writerId)
                .specification(specification)
                .build();
    }

    public void updateComment(String comment){
        this.comment = comment;
    }
}
