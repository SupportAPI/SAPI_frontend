package com.seniorcenter.sapi.domain.statistics.domain;

import java.time.LocalDate;

import com.seniorcenter.sapi.domain.workspace.domain.Workspace;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "statistics")
public class Statistics {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	@Column(nullable = false)
	private Long userId;

	@Column(nullable = false)
	private LocalDate date;

	@Column(nullable = false)
	private Integer successCount;

	@Builder
	private Statistics(Workspace workspace, Long userId, LocalDate date, Integer successCount) {
		this.workspace = workspace;
		this.userId = userId;
		this.date = date;
		this.successCount = successCount;
	}

	public static Statistics createStatistics(Workspace workspace, Long userId, LocalDate date, Integer successCount) {
		return Statistics.builder()
			.workspace(workspace)
			.userId(userId)
			.date(date)
			.successCount(successCount)
			.build();
	}

	public void updateSuccessCount(Integer successCount) {
		this.successCount = successCount;
	}
}
