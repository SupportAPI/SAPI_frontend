package com.seniorcenter.sapi.domain.api.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ApiType {
    OCCUPATION("OCCUPATION"),
    API_NAME("API_NAME"),
    CATEGORY("CATEGORY"),
    API_METHOD("API_METHOD"),
    API_PATH("API_PATH"),
    API_DESCRIPTION("API_DESCRIPTION"),
    PARAMETERS("PARAMETERS"),
    PARAMETERS_AUTH_TYPE("PARAMETERS_AUTH_TYPE"),
    PARAMETERS_HEADERS("PARAMETERS_HEADERS"),
    PARAMETERS_QUERY_PARAMETERS("PARAMETERS_QUERY_PARAMETERS"),
    PARAMETERS_COOKIES("PARAMETERS_COOKIES"),
    REQUEST_TYPE("REQUEST_TYPE"),
    REQUEST_FORM_DATA("REQUEST_FORM_DATA"),
    REQUEST_DATA("REQUEST_DATA");

    private String value;
}
