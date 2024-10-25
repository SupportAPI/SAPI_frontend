package com.seniorcenter.sapi.domain.user.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.user.domain.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

	Optional<EmailVerification> findByEmail(String email);
}
