package com.seniorcenter.sapi.global.interceptor;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.security.auth.AuthDetails;
import com.seniorcenter.sapi.global.security.jwt.TokenProvider;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.Map;

public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthHandshakeInterceptor(TokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String query = request.getURI().getQuery();
        if (query != null && query.contains("accessToken=")) {
            String token = query.split("accessToken=")[1];

            if (tokenProvider.validateToken(token)) {
                String userId = tokenProvider.getJws(token).getSubject();

                User user = userRepository.findById(Long.valueOf(userId))
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
                UserDetails userDetails = new AuthDetails(user);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);

                attributes.put("principal", authentication);

                return true;
            }
        }

        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
