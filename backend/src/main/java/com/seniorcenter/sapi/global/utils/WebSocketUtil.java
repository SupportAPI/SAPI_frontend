package com.seniorcenter.sapi.global.utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        for (SimpUser user : simpUserRegistry.getUsers()) {
            for (var session : user.getSessions()) {
                for (var subscription : session.getSubscriptions()) {
                    log.info("");
                    if (destination.equals(subscription.getDestination())) {
                        count++;
                    }
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
