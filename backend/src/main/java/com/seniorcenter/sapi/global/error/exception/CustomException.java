package com.seniorcenter.sapi.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

	/* 400 BAD_REQUEST : 잘못된 요청 */
	WRONG_TYPE_EXCEPTION(400, "잘못된 형식의 데이터입니다."),
	S3_UPLOAD_EXCEPTION(400, "파일 업로드를 실패했습니다."),
	VERIFICATION_CODE_EXPIRED(400, "인증번호가 만료되었습니다"),
	VERIFICATION_CODE_MISMATCH(400, "인증번호가 일치하지 않습니다"),

	/* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
	NOT_FOUND_SESSION_EXCEPTION(401, "세션이 존재하지 않습니다."),
	EXPIRED_JWT_EXCEPTION(401, "토큰이 만료했습니다."),
	EXPIRED_REFRESH_TOKEN_EXCEPTION(401, "리프레시 토큰이 만료했습니다."),
	NOT_VALID_JWT_EXCEPTION(401, "토큰이 유효하지 않습니다."),

	/* 403 FORBIDDEN : 리소스에 대한 접근이 금지됨 */
	ACCESS_DENIED_EXCEPTION(403, "권한이 없습니다"),

	/* 404 NOT_FOUND : 리소스를 찾을 수 없음 */
	NOT_FOUND_USER_EXCEPTION(404, "해당하는 정보의 사용자를 찾을 수 없습니다."),
	NOT_FOUND_EMAIL(404, "이메일을 찾을 수 없습니다"),
	NOT_FOUND_WORKSPACE(404, "해당하는 워크스페이스를 찾을 수 없습니다."),
	NOT_FOUND_MEMBERSHIP(404, "해당하는 워크스페이스 관련 유저 정보를 찾을 수 없습니다."),
	NOT_FOUND_DOCS(404,"해당하는 API 문서를 찾을 수 없습니다."),

	/* 409 중복된 리소스 */
	EMAIL_ALREADY_VERIFIED(409, "이 이메일은 이미 인증되었습니다"),


	/* 500 SERVER_ERROR */
	INTERNAL_SERVER_ERROR(500,"서버 에러"),
	EMAIL_SEND_FAILED(500, "이메일 전송에 실패했습니다"),
	IMAGE_PROCESSING(500, "이미지 처리 중 오류가 발생했습니다.");

	private int status;
	private String reason;
}
