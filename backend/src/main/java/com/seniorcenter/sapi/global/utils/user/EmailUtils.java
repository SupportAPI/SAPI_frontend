package com.seniorcenter.sapi.global.utils.user;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailUtils {

	private final JavaMailSender mailSender;
	private final TemplateEngine templateEngine;

	public void sendEmail(String toEmail, String subject, String templateName, Map<String, Object> variables) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setFrom("ksh.ssafy@gmail.com", "SAPI");
			helper.setTo(toEmail);
			helper.setSubject(subject);

			Context context = new Context();
			context.setVariables(variables);

			String htmlContent = templateEngine.process(templateName, context);
			helper.setText(htmlContent, true);

			mailSender.send(message);
		} catch (MessagingException | UnsupportedEncodingException e) {
			throw new MainException(CustomException.EMAIL_SEND_FAILED);
		}
	}
}
