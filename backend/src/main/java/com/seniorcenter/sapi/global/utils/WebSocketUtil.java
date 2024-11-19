package com.seniorcenter.sapi.global.utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.user.SimpSession;
import org.springframework.messaging.simp.user.SimpSubscription;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketUtil {

    private final SimpUserRegistry simpUserRegistry;

    public int countUsersSubscribedToDestination(String destination) {
        int count = 0;
        log.info("Total connected users: " + simpUserRegistry.getUserCount());
        for (SimpUser user : simpUserRegistry.getUsers()) {
            log.info("User: " + user.getName());
            for (SimpSession session : user.getSessions()) {
                log.info("Session: " + session.getId());
                for (SimpSubscription subscription : session.getSubscriptions()) {
                    log.info("Subscribed to: " + subscription.getDestination());
                }
            }
        }
        return count;
    }

    public int countUsersSubscribedToDestinationByLambda(String destination) {
        AtomicInteger count = new AtomicInteger();
        for (SimpUser user : simpUserRegistry.getUsers()) {
            user.getSessions().forEach(session -> {
                session.getSubscriptions().forEach(subscription -> {
                    if (destination.equals(subscription.getDestination())) {
                        count.incrementAndGet();
                    }
                });
            });
        }
        return count.get();
    }
}
