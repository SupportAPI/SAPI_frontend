package com.seniorcenter.sapi.global.config;

import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.interceptor.AuthHandshakeInterceptor;
import com.seniorcenter.sapi.global.security.jwt.TokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketConnectionInterceptor webSocketConnectionInterceptor;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Autowired
    public WebSocketConfig(WebSocketConnectionInterceptor webSocketConnectionInterceptor, TokenProvider tokenProvider, UserRepository userRepository) {
        this.webSocketConnectionInterceptor = webSocketConnectionInterceptor;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/ws/sub");
        config.setApplicationDestinationPrefixes("/ws/pub");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/ws-stomp")
                .setAllowedOriginPatterns("*")
                .addInterceptors(new AuthHandshakeInterceptor(tokenProvider, userRepository))
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketConnectionInterceptor);
    }
}
