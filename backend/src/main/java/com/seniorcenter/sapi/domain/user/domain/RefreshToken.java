package com.seniorcenter.sapi.domain.user.domain;

import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

import com.seniorcenter.sapi.global.database.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(name = "refresh_tokens")
public class RefreshToken extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "refresh_token_id")
	private Long id;

	private String value;

	private Long userId;

	@Builder
	public RefreshToken(String value, Long userId) {
		this.value = value;
		this.userId = userId;
	}

	public RefreshToken updateValue(String token) {
		this.value = token;
		return this;
	}
}
