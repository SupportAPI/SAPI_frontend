package com.seniorcenter.sapi.domain.user.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seniorcenter.sapi.domain.user.domain.EmailVerification;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.EmailVerificationRepository;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.NewPasswordRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.SendCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.VerifyCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.EmailUtils;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final EmailVerificationRepository emailVerificationRepository;
	private final UserUtils userUtils;
	private final EmailUtils emailUtils;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserInfoResponseDto getUserInfo(Long userId) {
		User user = userUtils.getUserFromSecurityContext();

		if (!user.getId().equals(userId)) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		return new UserInfoResponseDto(user.getId(), user.getEmail(), user.getNickname(), user.getProfileImage());
	}

	@Override
	public boolean checkDuplicateEmail(String email) {
		return userRepository.existsByEmail(email);
	}

	@Transactional
	@Override
	public void sendEmailCode(SendCodeRequestDto sendCodeRequestDto) {
		EmailVerification emailVerification = emailVerificationRepository
			.findByEmail(sendCodeRequestDto.email())
			.orElseGet(() -> EmailVerification.createEmailVerification(sendCodeRequestDto.email()));

		if (emailVerification.getId() != null) {
			emailVerification.refreshVerificationCode();
		} else {
			emailVerificationRepository.save(emailVerification);
		}

		Map<String, Object> variables = Map.of(
			"verificationCode", emailVerification.getVerificationCode()
		);

		String subject = "SAPI 이메일 인증 코드";
		String template = "signupEmailTemplate";
		emailUtils.sendEmail(sendCodeRequestDto.email(), subject, template, variables);
	}

	@Transactional
	@Override
	public void verifyEmailCode(VerifyCodeRequestDto verifyCodeRequestDto) {
		EmailVerification emailVerification = emailVerificationRepository.findByEmail(verifyCodeRequestDto.email())
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_EMAIL));

		if(!emailVerification.isCodeValid()) {
			throw new MainException(CustomException.VERIFICATION_CODE_EXPIRED);
		}

		if (!emailVerification.getVerificationCode().equals(verifyCodeRequestDto.code())) {
			throw new MainException(CustomException.VERIFICATION_CODE_MISMATCH);
		}
	}

	@Transactional
	@Override
	public void updatePassword(Long userId, NewPasswordRequestDto newPasswordRequestDto) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));

		if (!user.getId().equals(userUtils.getUserFromSecurityContext().getId())) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		user.changePassword(passwordEncoder.encode(newPasswordRequestDto.password()));
	}
}
