package com.seniorcenter.sapi.global.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketUtil {

    private final SimpUserRegistry simpUserRegistry;

    public int countUsersSubscribedToDestination(String destination) {
        int count = 0;
        for (SimpUser user : simpUserRegistry.getUsers()) {
            for (var session : user.getSessions()) {
                for (var subscription : session.getSubscriptions()) {
                    if (destination.equals(subscription.getDestination())) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
}
