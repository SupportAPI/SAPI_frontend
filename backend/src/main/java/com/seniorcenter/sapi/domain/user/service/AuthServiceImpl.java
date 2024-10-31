package com.seniorcenter.sapi.domain.user.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seniorcenter.sapi.domain.user.domain.RefreshToken;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.RefreshTokenRepository;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.CreateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.LoginRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.RequestTokenDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserResponseDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.security.jwt.TokenDto;
import com.seniorcenter.sapi.global.security.jwt.TokenProvider;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final TokenProvider tokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;

	@Override
	@Transactional
	public UserResponseDto signup(CreateUserRequestDto joinRequest) {
		if (userRepository.existsByEmail(joinRequest.email())) {
			throw new RuntimeException("이미 가입되어 있는 유저입니다");
		}

		User user = User.signUpUser(joinRequest.encodePassword(passwordEncoder.encode(joinRequest.password())), "https://sapibucket.s3.ap-northeast-2.amazonaws.com/default_images/basic_image.png");
		userRepository.save(user);
		return new UserResponseDto(user.getId(), user.getEmail(), user.getNickname(), user.getProfileImage());
	}

	@Override
	@Transactional
	public TokenDto login(LoginRequestDto loginRequest, HttpServletResponse response) {

		User user = userRepository.findByEmail(loginRequest.email())
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
		UsernamePasswordAuthenticationToken authenticationToken
			= new UsernamePasswordAuthenticationToken(user.getId(), loginRequest.password());

		// authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername 메서드가 실행됨
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

		TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

		RefreshToken refreshToken = RefreshToken.builder()
			.userId(Long.valueOf(authentication.getName()))
			.value(tokenDto.getRefreshToken())
			.build();

		refreshTokenRepository.findByUserId(user.getId()).ifPresent(refreshTokenRepository::delete);
		refreshTokenRepository.save(refreshToken);

		// TODO: 추후 Cookie, Session 중 저장 방식 확정하여 로직 최적화
		tokenProvider.setHeaderAccessToken(response, tokenDto.getAccessToken());
		tokenProvider.setHeaderRefreshToken(response, refreshToken.getValue());

		return tokenDto;
	}

	@Override
	@Transactional
	public TokenDto reissue(RequestTokenDto requestTokenDto, HttpServletResponse response) {
		if (!tokenProvider.validateToken(requestTokenDto.refreshToken())) {
			throw new RuntimeException("Refresh Token 이 유효하지 않습니다.");
		}

		Authentication authentication = tokenProvider.getAuthentication(requestTokenDto.accessToken());

		RefreshToken refreshToken = refreshTokenRepository.findByUserId(Long.valueOf(authentication.getName()))
			.orElseThrow(() -> new RuntimeException("로그아웃 된 사용자입니다."));

		if (!refreshToken.getValue().equals(requestTokenDto.refreshToken())) {
			throw new RuntimeException("토큰의 유저 정보가 일치하지 않습니다.");
		}

		TokenDto tokenDto;
		if (tokenProvider.refreshTokenPeriodCheck(refreshToken.getValue())) {
			tokenDto = tokenProvider.generateTokenDto(authentication);

			RefreshToken newRefreshToken = refreshToken.updateValue(tokenDto.getRefreshToken());
			refreshTokenRepository.save(newRefreshToken);
		} else {
			tokenDto = tokenProvider.createAccessToken(authentication);
		}

		// TODO: 추후 Cookie, Session 중 저장 방식 확정하여 로직 최적화
		tokenProvider.setHeaderAccessToken(response, tokenDto.getAccessToken());
		tokenProvider.setHeaderRefreshToken(response, refreshToken.getValue());

		return tokenDto;
	}
}
