package com.seniorcenter.sapi.domain.user.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.user.domain.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByUserId(Long userId);

}
