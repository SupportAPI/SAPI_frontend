package com.seniorcenter.sapi.domain.comment.domain.repository;

import com.seniorcenter.sapi.domain.comment.domain.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Comment findBySpecificationId(UUID specificationId);

    List<Comment> findBySpecificationIdOrderByCreatedDateAsc(UUID docId);

    Comment findFirstBySpecificationIdOrderByCreatedDateDesc(UUID docId);

    @Query("SELECT c FROM Comment c " +
            "WHERE c.specification.id = :docId " +
            "AND (c.createdDate <= (SELECT target.createdDate FROM Comment target WHERE target.id = :targetId)) " +
            "ORDER BY c.createdDate DESC")
    List<Comment> findPreviousCommentsBySpecificationIdAndTargetId(
            @Param("docId") UUID docId,
            @Param("targetId") Long targetId,
            Pageable pageable);
}

