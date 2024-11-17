package com.seniorcenter.sapi.domain.comment.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.comment.domain.Comment;
import com.seniorcenter.sapi.domain.comment.domain.CommentType;
import com.seniorcenter.sapi.domain.comment.domain.repository.CommentRepository;
import com.seniorcenter.sapi.domain.comment.presentation.dto.response.CommentResponseDto;
import com.seniorcenter.sapi.domain.comment.presentation.dto.response.CommentUserResponseDto;
import com.seniorcenter.sapi.domain.comment.presentation.message.CommentMessage;
import com.seniorcenter.sapi.domain.comment.presentation.message.CommentPart;
import com.seniorcenter.sapi.domain.comment.presentation.message.CommentUpdateMessage;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.type.MessageType;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final SimpMessageSendingOperations messagingTemplate;
    private final CommentRepository commentRepository;
    private final SpecificationRepository specificationRepository;
    private final UserUtils userUtils;
    private final String splitText = "/&#@*!/";
    private final String userSpecifier = "/%^)(/";
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final SimpUserRegistry simpUserRegistry;

    @Transactional
    public Comment createComment(CommentMessage message, UUID docId, Principal principal) {
        User user = userUtils.getUserFromSecurityPrincipal(principal);
        Specification specification = specificationRepository.findById(docId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        List<CommentPart> messages;

        try {
            messages = objectMapper.convertValue(message.message(), new TypeReference<List<CommentPart>>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        String text = makeCommentText(messages);
        Comment comment = Comment.createComment(text, user.getId(), specification);
        commentRepository.save(comment);
        return comment;
    }

    public List<CommentResponseDto> getComments(UUID docId, Principal principal) {
        List<Comment> comments = commentRepository.findBySpecificationIdOrderByCreatedDateAsc(docId);
        List<CommentResponseDto> commentResponseDtos = new ArrayList<>();
        for (Comment comment : comments) {
            CommentResponseDto commentResponseDto = translateToCommentResponseDtoByPrincipal(comment, principal);
            commentResponseDtos.add(commentResponseDto);
        }
        return commentResponseDtos;
    }

    public List<CommentResponseDto> getComments(UUID docId, Long targetCommentId, int size) {
        Pageable pageable = PageRequest.of(0, size);
        List<Comment> comments = commentRepository.findPreviousCommentsBySpecificationIdAndTargetId(docId, targetCommentId, pageable);
        List<CommentResponseDto> commentResponseDtos = new ArrayList<>();
        for (Comment comment : comments) {
            CommentResponseDto commentResponseDto = translateToCommentResponseDto(comment);
            commentResponseDtos.add(commentResponseDto);
        }
        return commentResponseDtos;
    }

    public Long getCommentId(UUID docId) {
        Comment comment = commentRepository.findFirstBySpecificationIdOrderByCreatedDateDesc(docId);
        if (comment == null) return -1L;
        return comment.getId();
    }

    @Transactional
    public void updateComment(CommentMessage message, UUID docId, Principal principal) {
        User user = userUtils.getUserFromSecurityPrincipal(principal);
        CommentUpdateMessage updateMessage;
        try {
            updateMessage = objectMapper.convertValue(message.message(), CommentUpdateMessage.class);
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }

        Long commentId = updateMessage.commentId();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_COMMENT));
        if (comment.getWriterId() != user.getId()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        List<CommentPart> messages = updateMessage.message();
        String modifiedMessage = makeCommentText(messages);
        comment.updateComment(modifiedMessage);
        CommentResponseDto commentResponseDto = translateToCommentResponseDtoByPrincipal(comment, principal);
        messagingTemplate.convertAndSend("/ws/sub/docs/" + docId + "/comments" + "/user/" + principal.getName() + "/message", new CommentMessage(MessageType.UPDATE, commentResponseDto));
        CommentResponseDto yourMessage = new CommentResponseDto(commentResponseDto.commentId(), commentResponseDto.writerNickname(), commentResponseDto.writerProfileImage(), commentResponseDto.comment(), commentResponseDto.createdDate(), false);
        sendToAllExceptSender(principal.getName(), docId, new CommentMessage(MessageType.UPDATE, yourMessage));
    }

    @Transactional
    public void deleteComment(CommentMessage message, UUID docId, Principal principal) {
        User user = userUtils.getUserFromSecurityPrincipal(principal);
        Long commentId = Long.valueOf((Integer) message.message());
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_COMMENT));
        if (comment.getWriterId() != user.getId()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }
        commentRepository.delete(comment);
        sendToAll(docId, message);
    }

    public CommentResponseDto translateToCommentResponseDto(Comment comment) {
        User user = userUtils.getUserFromSecurityContext();
        boolean isHost = false;
        if (comment.getWriterId() == user.getId()) {
            isHost = true;
        }
        User writer = userRepository.findById(comment.getWriterId())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
        CommentResponseDto commentResponseDto = new CommentResponseDto(comment.getId(), writer.getNickname(), writer.getProfileImage(), new ArrayList<>(), comment.getCreatedDate(), isHost);
        String text = comment.getComment();
        String[] split = text.split(Pattern.quote(splitText));
        for (String str : split) {
            if (str.startsWith(userSpecifier)) {
                String userStr = str.substring(userSpecifier.length());
                User tagedUser = userRepository.findById(Long.parseLong(userStr))
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
                commentResponseDto.comment().add(new CommentResponseDto.CommentPart(CommentType.USER, new CommentUserResponseDto(tagedUser)));
            } else {
                commentResponseDto.comment().add(new CommentResponseDto.CommentPart(CommentType.TEXT, str));
            }
        }
        return commentResponseDto;
    }

    public CommentResponseDto translateToCommentResponseDtoByPrincipal(Comment comment, Principal principal) {
        User user = userUtils.getUserFromSecurityPrincipal(principal);
        boolean isHost = false;
        if (comment.getWriterId() == user.getId()) {
            isHost = true;
        }
        User writer = userRepository.findById(comment.getWriterId())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
        CommentResponseDto commentResponseDto = new CommentResponseDto(comment.getId(), writer.getNickname(), writer.getProfileImage(), new ArrayList<>(), comment.getCreatedDate(), isHost);
        String text = comment.getComment();
        String[] split = text.split(Pattern.quote(splitText));
        for (String str : split) {
            if (str.startsWith(userSpecifier)) {
                String userStr = str.substring(userSpecifier.length());
                User tagedUser = userRepository.findById(Long.parseLong(userStr))
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
                commentResponseDto.comment().add(new CommentResponseDto.CommentPart(CommentType.USER, new CommentUserResponseDto(tagedUser)));
            } else {
                commentResponseDto.comment().add(new CommentResponseDto.CommentPart(CommentType.TEXT, str));
            }
        }
        return commentResponseDto;
    }

    @Transactional
    public void createAndSendComment(CommentMessage message, UUID docId, Principal principal) {
        Comment comment = createComment(message, docId, principal);
        CommentResponseDto commentResponseDto = translateToCommentResponseDtoByPrincipal(comment, principal);
        System.out.println("/ws/sub/docs/" + docId + "/comments" + "/user/" + principal.getName() + "/message");
        messagingTemplate.convertAndSend("/ws/sub/docs/" + docId + "/comments" + "/user/" + principal.getName() + "/message", new CommentMessage(MessageType.ADD, commentResponseDto));
        CommentResponseDto yourMessage = new CommentResponseDto(commentResponseDto.commentId(), commentResponseDto.writerNickname(), commentResponseDto.writerProfileImage(), commentResponseDto.comment(), commentResponseDto.createdDate(), false);
        sendToAllExceptSender(principal.getName(), docId, new CommentMessage(MessageType.ADD, yourMessage));
    }

    public String makeCommentText(List<CommentPart> messages) {
        String resultText = "";
        for (CommentPart part : messages) {
            if (part.type().equals(CommentType.TEXT)) {
                resultText += part.value() + splitText;
            } else if (part.type().equals(CommentType.USER)) {
                Optional<User> user = userRepository.findById(Long.valueOf(part.value()));
                if (!user.isPresent()) {
                    resultText += "@" + part.nickname() + "-" + part.value() + splitText;
                } else if (!part.nickname().equals(user.get().getNickname())) {
                    resultText += part.value() + splitText;
                } else {
                    resultText += userSpecifier + part.value() + splitText;
                }
            }
        }
        return resultText;
    }

    public void sendToAllExceptSender(String senderUserName, UUID docId, Object messageContent) {
        for (SimpUser user : simpUserRegistry.getUsers()) {
            if (!user.getName().equals(senderUserName)) {
                user.getSessions().forEach(session -> {
                    session.getSubscriptions().forEach(subscription -> {
                        String targetDestination = "/ws/sub/docs/" + docId + "/comments" + "/user/" + user.getName() + "/message";
                        if (targetDestination.equals(subscription.getDestination())) {
                            messagingTemplate.convertAndSend(targetDestination, messageContent);
                        }
                    });
                });
            }
        }
    }

    public void sendToAll(UUID docId, Object messageContent) {
        for (SimpUser user : simpUserRegistry.getUsers()) {
            user.getSessions().forEach(session -> {
                session.getSubscriptions().forEach(subscription -> {
                    String targetDestination = "/ws/sub/docs/" + docId + "/comments" + "/user/" + user.getName() + "/message";
                    if (targetDestination.equals(subscription.getDestination())) {
                        messagingTemplate.convertAndSend(targetDestination, messageContent);
                    }
                });
            });
        }
    }

}
