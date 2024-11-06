package com.seniorcenter.sapi.domain.comment.presentation;

import com.seniorcenter.sapi.domain.comment.presentation.dto.response.CommentResponseDto;
import com.seniorcenter.sapi.domain.comment.presentation.message.CommentMessage;
import com.seniorcenter.sapi.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/docs/{docId}/comments")
    public List<CommentResponseDto> getComments(@PathVariable("docId") UUID docId,
                                                @RequestParam Long targetcommentid,
                                                @RequestParam int size ) {
        return commentService.getComments(docId,targetcommentid,size);
    }

    @GetMapping("/docs/{docId}/comments/last-index")
    public Long getLastIndexComments(@PathVariable("docId") UUID docId) {
        return commentService.getCommentId(docId);
    }

//    @PostMapping("/comment/{docId}/test")
//    public void createComment(@PathVariable("docId") UUID docId, @RequestBody CommentMessage message) {
//        log.info("Received message with docsId {}: {}", docId, message);
//        commentService.createComment(message, docId);
//    }
//
//    @PutMapping("/comment/{docId}/test")
//    public void updateComment(@PathVariable("docId") UUID docId, @RequestBody CommentMessage message) {
//        log.info("Received message with docsId {}: {}", docId, message);
//        commentService.updateComment(message, docId);
//    }
//
//    @DeleteMapping("/comment/{docId}/test")
//    public void deleteComment(@PathVariable("docId") UUID docId, @RequestBody CommentMessage message) {
//        log.info("Received message with docsId {}: {}", docId, message);
//        commentService.deleteComment(message, docId);
//    }

}
