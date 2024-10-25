package com.seniorcenter.sapi.global.security.jwt;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.config.JwtValueConfig;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.security.auth.AuthDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenProvider {

	private static final String AUTHORITIES = "ROLE_USER";
	private static final String AUTHORITIES_KEY = "auth";
	private static final String BEARER_TYPE = "Bearer";
	private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24;            // 1일
	private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;  // 7일
	private static final long THREE_DAYS = 1000 * 60 * 60 * 24 * 3;  // 3일

	private final JwtValueConfig jwtValueConfig;
	private final UserRepository userRepository;

	public TokenDto createAccessToken(Authentication authentication) {
		long now = (new Date()).getTime();

		Date accessTokenExpiresIn = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
		String accessToken = Jwts.builder()
			.setSubject(authentication.getName())
			.claim(AUTHORITIES_KEY, AUTHORITIES)
			.setExpiration(accessTokenExpiresIn)
			.signWith(getSecretKey(), SignatureAlgorithm.HS256)
			.compact();

		return TokenDto.builder()
			.grantType(BEARER_TYPE)
			.accessToken(accessToken)
			.accessTokenExpiresIn(accessTokenExpiresIn.getTime())
			.refreshToken(null)
			.build();
	}

	public TokenDto generateTokenDto(Authentication authentication) {
		long now = (new Date()).getTime();

		Date accessTokenExpiresIn = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
		String accessToken = Jwts.builder()
			.setSubject(authentication.getName())
			.claim(AUTHORITIES_KEY, AUTHORITIES)
			.setExpiration(accessTokenExpiresIn)
			.signWith(getSecretKey(), SignatureAlgorithm.HS256)
			.compact();

		String refreshToken = Jwts.builder()
			.setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
			.signWith(getSecretKey(), SignatureAlgorithm.HS256)
			.compact();

		return TokenDto.builder()
			.grantType(BEARER_TYPE)
			.accessToken(accessToken)
			.accessTokenExpiresIn(accessTokenExpiresIn.getTime())
			.refreshToken(refreshToken)
			.build();
	}

	public Authentication getAuthentication(String accessToken) {
		Claims claims = parseClaims(accessToken);
		String userId = getJws(accessToken).getSubject();

		Collection<? extends GrantedAuthority> authorities =
			Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());

		User user = userRepository.findById(Long.valueOf(userId))
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
		UserDetails principal = new AuthDetails(user);

		return new UsernamePasswordAuthenticationToken(principal, "", principal.getAuthorities());
	}

	private Claims getJws(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(getSecretKey())
				.build().parseClaimsJws(token).getBody();
		} catch (ExpiredJwtException e) {
			throw new MainException(CustomException.EXPIRED_JWT_EXCEPTION);
		} catch (Exception e) {
			throw new MainException(CustomException.NOT_VALID_JWT_EXCEPTION);
		}
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtValueConfig.getSecretKey())))
				.build().parseClaimsJws(token);
			return true;
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
			log.info("잘못된 JWT 서명입니다.");
		} catch (ExpiredJwtException e) {
			log.info("만료된 JWT 토큰입니다.");
		} catch (UnsupportedJwtException e) {
			log.info("지원되지 않는 JWT 토큰입니다.");
		} catch (IllegalArgumentException e) {
			log.info("JWT 토큰이 잘못되었습니다.");
		}
		return false;
	}

	public boolean refreshTokenPeriodCheck(String token) {
		Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(getSecretKey())
			.build().parseClaimsJws(token);
		long now = (new Date()).getTime();
		long refresh_expiredTime = claimsJws.getBody().getExpiration().getTime();
		long refresh_nowTime = new Date(now + REFRESH_TOKEN_EXPIRE_TIME).getTime();

		if (refresh_nowTime - refresh_expiredTime > THREE_DAYS) {
			return true;
		}
		return false;
	}

	public void setHeaderAccessToken(HttpServletResponse response, String accessToken) {
		Cookie accessTokenCookie = new Cookie("SAPI_TOKEN", accessToken);
		accessTokenCookie.setMaxAge(86400);
		accessTokenCookie.setPath("/");
		accessTokenCookie.setHttpOnly(true);

		response.addHeader("Set-Cookie", "SAPI_TOKEN=" + accessToken + "; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=None");
	}

	public void setHeaderRefreshToken(HttpServletResponse response, String refreshToken) {
		Cookie refreshTokenCookie = new Cookie("SAPI_TOKEN_REFRESH", refreshToken);
		refreshTokenCookie.setMaxAge(604800);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setHttpOnly(true);

		response.addHeader("Set-Cookie", "SAPI_TOKEN_REFRESH=" + refreshToken + "; Max-Age=604800; Path=/; HttpOnly; Secure; SameSite=None");
	}

	private Key getSecretKey() {
		return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtValueConfig.getSecretKey()));
	}

	private Claims parseClaims(String accessToken) {
		try {
			return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtValueConfig.getSecretKey())))
				.build().parseClaimsJws(accessToken).getBody();
		} catch (ExpiredJwtException e) {
			return e.getClaims();
		}
	}
}
