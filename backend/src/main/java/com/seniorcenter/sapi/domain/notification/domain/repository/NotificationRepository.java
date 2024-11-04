package com.seniorcenter.sapi.domain.notification.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.notification.domain.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByUserId(Long userId);
}
