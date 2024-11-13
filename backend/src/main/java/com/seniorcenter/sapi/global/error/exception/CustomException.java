package com.seniorcenter.sapi.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    /* 400 BAD_REQUEST : 잘못된 요청 */
    WRONG_TYPE_EXCEPTION(400, "잘못된 형식의 데이터입니다."),
    MISSING_PARAMS(400, "필수 파라미터가 누락되었습니다."),
    S3_UPLOAD_EXCEPTION(400, "파일 업로드를 실패했습니다."),
    FILE_SIZE_EXCEEDED(400, "파일 크기가 5MB를 초과합니다."),
    FILE_PROCESSING_EXCEPTION(400, "파일 처리 중 오류가 발생했습니다."),
    VERIFICATION_CODE_EXPIRED(400, "인증번호가 만료되었습니다"),
    VERIFICATION_CODE_MISMATCH(400, "인증번호가 일치하지 않습니다"),
    INVALID_FORMAT(400, "입력 형태가 올바르지 않습니다."),
    INVALID_JSON_FORMAT(400, "잘못된 JSON 형식입니다."),

    NOT_ALLOWED_INVITE_SELF(400, "자신을 워크스페이스에 초대할 수 없습니다."),
    FAIL_TO_SEND_NOTIFICATION(400, "알림 전송이 실패했습니다."),
    FAIL_SECESSION_BY_MAINTAINER(400, "관리자는 워크스페이스 탈퇴가 불가합니다. 다른 멤버에게 관리자 역할을 부여해주세요."),

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    NOT_FOUND_SESSION_EXCEPTION(401, "세션이 존재하지 않습니다."),
    EXPIRED_JWT_EXCEPTION(401, "토큰이 만료했습니다."),
    EXPIRED_REFRESH_TOKEN_EXCEPTION(401, "리프레시 토큰이 만료했습니다."),
    NOT_VALID_JWT_EXCEPTION(401, "토큰이 유효하지 않습니다."),

    /* 403 FORBIDDEN : 리소스에 대한 접근이 금지됨 */
    ACCESS_DENIED_EXCEPTION(403, "권한이 없습니다."),

    /* 404 NOT_FOUND : 리소스를 찾을 수 없음 */
    NOT_FOUND_USER_EXCEPTION(404, "해당하는 정보의 사용자를 찾을 수 없습니다."),
    NOT_FOUND_EMAIL(404, "이메일을 찾을 수 없습니다"),
    NOT_FOUND_WORKSPACE(404, "해당하는 워크스페이스를 찾을 수 없습니다."),
    NOT_FOUND_MEMBERSHIP(404, "해당하는 워크스페이스 관련 유저 정보를 찾을 수 없습니다."),
    NOT_FOUND_DOCS(404, "해당하는 API 문서를 찾을 수 없습니다."),
    NOT_FOUND_NOTIFICATION(404, "해당하는 알림을 찾을 수 없습니다."),
    NOT_FOUND_COMMENT(404, "해당하는 댓글을 찾을 수 없습니다."),
    NOT_FOUND_CATEGORY(404, "해당하는 카테고리를 찾을 수 없습니다."),
    NOT_FOUND_API(404, "해당하는 API를 찾을 수 없습니다."),
    NOT_FOUND_QUERY_PARAMETER(404, "해당하는 쿼리 파라미터를 찾을 수 없습니다."),
    NOT_FOUND_HEADER(404, "해당하는 HEADER 정보를 찾을 수 없습니다."),
    NOT_FOUNT_COOKIE(404, "해당하는 COOKIE 정보를 찾을 수 없습니다."),
    NOT_FOUND_ENVIRONMENT(404, "해당하는 환경변수를 찾을 수 없습니다."),
    NOT_FOUND_FILE(404, "해당하는 파일을 찾을 수 없습니다."),
    NOT_FOUND_ENVIRONMENT_CATEGORY(404, "해당하는 환경변수 카테고리를 찾을 수 없습니다."),

    /* 409 중복된 리소스 */
    EMAIL_ALREADY_VERIFIED(409, "이 이메일은 이미 인증되었습니다"),
    DUPLICATE_CATEGORY(409, "이미 존재하는 카테고리입니다."),
    /* 409 상태 충돌 */
    SPECIFICATION_CHANGED(409, "명세의 정보가 변경되었습니다."),

    /* 500 SERVER_ERROR */
    INTERNAL_SERVER_ERROR(500, "서버 에러"),
    EMAIL_SEND_FAILED(500, "이메일 전송에 실패했습니다"),
    IMAGE_PROCESSING(500, "이미지 처리 중 오류가 발생했습니다.");

    private int status;
    private String reason;
}
