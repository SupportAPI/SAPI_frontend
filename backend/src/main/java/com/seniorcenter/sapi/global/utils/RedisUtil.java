package com.seniorcenter.sapi.global.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RedisUtil {

    private final RedisTemplate<String, Object> redisTemplate;
    private final HashOperations<String, String, Object> hashOperations;

    @Autowired
    public RedisUtil(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash(); // Hash operations 초기화
    }

    // 데이터를 Redis Hash에 저장
    public void saveData(String hashKey, String field, String value) {
        hashOperations.put(hashKey, field, value);
    }

    // 데이터를 Redis Hash에서 조회
    public String getData(String hashKey, String field) {
        Object value = hashOperations.get(hashKey, field);
        return value != null ? value.toString() : null;
    }

    // Redis Hash에서 특정 필드 삭제
    public void deleteData(String hashKey, String field) {
        hashOperations.delete(hashKey, field);
    }

    // Redis Hash에서 특정 필드 존재 여부 확인
    public boolean hasKey(String hashKey, String field) {
        return hashOperations.hasKey(hashKey, field);
    }

    // Redis Hash에서 특정 hashKey에 존재하는 모든 데이터 조회
    public Map<String, Object> getAllData(String hashKey) {
        return hashOperations.entries(hashKey);
    }
}
