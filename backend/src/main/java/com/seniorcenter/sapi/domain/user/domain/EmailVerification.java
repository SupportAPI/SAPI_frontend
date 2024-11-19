package com.seniorcenter.sapi.domain.user.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "email_verifications")
public class EmailVerification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String verificationCode;

	@Column(nullable = false)
	private LocalDateTime requestedAt;

	private static final long EXPIRATION_TIME_MINUTES = 3;

	@Builder
	private EmailVerification(String email, String verificationCode, LocalDateTime requestedAt) {
		this.email = email;
		this.verificationCode = verificationCode;
		this.requestedAt = requestedAt;
	}

	public static EmailVerification createEmailVerification(String email) {
		return builder()
			.email(email)
			.verificationCode(generateVerificationCode())
			.requestedAt(LocalDateTime.now())
			.build();
	}

	public void refreshVerificationCode() {
		this.verificationCode = generateVerificationCode();
		this.requestedAt = LocalDateTime.now();
	}

	public boolean isCodeValid() {
		return LocalDateTime.now().isBefore(this.requestedAt.plusMinutes(EXPIRATION_TIME_MINUTES));
	}

	private static String generateVerificationCode() {
		return String.valueOf((int) (Math.random() * 900000) + 100000);
	}

}
