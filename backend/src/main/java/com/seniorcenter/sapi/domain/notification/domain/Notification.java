package com.seniorcenter.sapi.domain.notification.domain;

import java.util.UUID;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "notifications")
public class Notification extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column
	private UUID fromId;

	@Column
	private UUID workspaceId;

	@Column
	private String fromName;

	@Column(nullable = false)
	private String message;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private NotificationType type;

	@Column(nullable = false)
	private Boolean isRead;

	@Builder
	private Notification(User user, UUID fromId, UUID workspaceId, String fromName, String message, NotificationType type) {
		this.user = user;
		this.fromId = fromId;
		this.workspaceId = workspaceId;
		this.fromName = fromName;
		this.message = message;
		this.type = type;
		this.isRead = false;
	}

	public static Notification createNotification(User user, UUID fromId, UUID workspaceId, String fromName, String message, NotificationType type) {
		return Notification.builder()
			.user(user)
			.fromId(fromId)
			.workspaceId(workspaceId)
			.fromName(fromName)
			.message(message)
			.type(type)
			.build();
	}

	public String getType() {
		return type.getType();
	}

	public void changeReadStatus() {
		this.isRead = true;
	}
}
