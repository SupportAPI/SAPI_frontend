package com.seniorcenter.sapi.domain.user.domain;

import org.hibernate.annotations.DynamicInsert;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.CreateUserRequestDto;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;

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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@Getter
@Table(name = "users")
public class User extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", nullable = false)
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String nickname;

	@Column(nullable = false)
	private String profileImage;

	@Builder
	private User(String email, String password, String nickname, String profileImage) {
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.profileImage = profileImage;
	}

	public static User signUpUser(CreateUserRequestDto createUserRequestDto, String profileImage) {
		return User.builder()
			.email(createUserRequestDto.email())
			.password(createUserRequestDto.password())
			.nickname(createUserRequestDto.nickname())
			.profileImage(profileImage)
			.build();
	}
}
