package com.seniorcenter.sapi.global.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;

import java.io.IOException;
import java.util.Map;

public class JsonUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Map<String, Object> convertStringToMap(String jsonString) {
        try {
            return objectMapper.readValue(jsonString, Map.class);
        } catch (IOException e) {
            throw new MainException(CustomException.INVALID_JSON_FORMAT);
        }
    }
}
