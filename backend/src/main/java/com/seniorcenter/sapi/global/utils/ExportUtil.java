package com.seniorcenter.sapi.global.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.pdf.BaseFont;
import com.seniorcenter.sapi.domain.api.presentation.dto.ApiDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class ExportUtil {

    private final TemplateEngine templateEngine;

    @Autowired
    public ExportUtil(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Value("classpath:fonts/NanumGothic.ttf")
    private Resource nanumGothicFont;


    public Context generatorContent(ApiDto apiDto) {
        Context context = new Context();
        context.setVariable("api", apiDto);
        return context;
    }

    public Context generatorHtmlContent(ApiDto apiDto) {
        List<ApiDto.ApiBodyDto> processedBodies = apiDto.bodies().stream()
            .map(body -> {
                if (body.parameterType().getValue().equals("JSON") && body.bodyValue() != null) {
                    String highlightedBodyValue = convertJsonToHighlightedHtml(body.bodyValue());
                    return new ApiDto.ApiBodyDto(
                        body.parameterType(),
                        body.bodyKey(),
                        highlightedBodyValue,
                        body.description(),
                        body.isRequired(),
                        body.isChecked()
                    );
                } else {
                    return body;
                }
            })
            .collect(Collectors.toList());

        List<ApiDto.ApiResponseDto> processedResponses = apiDto.responses().stream()
            .map(response -> {
                if (response.bodyType().getValue().equals("JSON") && response.bodyData() != null) {
                    String highlightedBodyData = convertJsonToHighlightedHtml(response.bodyData());
                    return new ApiDto.ApiResponseDto(
                        response.code(),
                        response.name(),
                        response.bodyType(),
                        highlightedBodyData,
                        response.description()
                    );
                } else {
                    return response;
                }
            })
            .collect(Collectors.toList());

        ApiDto processedApiDto = new ApiDto(
            apiDto.id(),
            apiDto.name(),
            apiDto.path(),
            apiDto.method(),
            apiDto.description(),
            apiDto.bodyType(),
            apiDto.authenticationType(),
            apiDto.category(),
            apiDto.headers(),
            apiDto.cookies(),
            apiDto.queryParameters(),
            apiDto.pathVariables(),
            processedBodies,
            processedResponses
        );

        Context context = new Context();
        context.setVariable("api", processedApiDto);
        return context;
    }

    public byte[] generateHtml(Context context) {
        String htmlContent = templateEngine.process("apiDetailTemplate", context);
        try {
            return htmlContent.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new MainException(CustomException.FILE_PROCESSING_EXCEPTION);
        }
    }

    public byte[] generatePdf(Context context) {
        try {
            String htmlContent = templateEngine.process("apiDetailTemplate", context);

            ITextRenderer renderer = new ITextRenderer();

            renderer.getFontResolver().addFont(nanumGothicFont.getFile().getPath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

            renderer.setDocumentFromString(htmlContent);
            renderer.layout();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            renderer.createPDF(outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new MainException(CustomException.FILE_PROCESSING_EXCEPTION);
        }
    }


    public byte[] generateMarkdown(Context context) {
        try {
            ApiDto api = (ApiDto) context.getVariable("api");
            StringBuilder markdownBuilder = new StringBuilder();

            // 기본 API 정보 작성
            markdownBuilder.append("# ").append(api.name()).append("\n\n");
            markdownBuilder.append("**Method:** `").append(api.method()).append("`  \n");
            markdownBuilder.append("**Path:** `").append(api.path()).append("`\n\n");
            markdownBuilder.append("---\n\n");

            // Description
            markdownBuilder.append("### Description\n");
            markdownBuilder.append("> ").append(api.description()).append("\n\n");
            markdownBuilder.append("---\n\n");

            // Request Section

            markdownBuilder.append("## Request\n\n");

            // Path Variables
            markdownBuilder.append("### Path Variables\n");
            if (!api.pathVariables().isEmpty()) {
                markdownBuilder.append("| PathVariable Key | PathVariable Value | Description |\n");
                markdownBuilder.append("|------------------|--------------------|---------------------------|\n");
                for (ApiDto.ApiPathVariableDto pathVariable : api.pathVariables()) {
                    markdownBuilder.append("| ").append(pathVariable.variableKey()).append(" | ")
                        .append(pathVariable.variableValue()).append(" | ")
                        .append(pathVariable.description()).append(" |\n");
                }
            } else {
                markdownBuilder.append("_No path variables available._\n\n");
            }
            markdownBuilder.append("\n");

            // Query Parameters
            markdownBuilder.append("### Query Parameters\n");
            if (!api.queryParameters().isEmpty()) {
                markdownBuilder.append("| Parameter Key | Parameter Value | Description |\n");
                markdownBuilder.append("|---------------|----------------|-------------|\n");
                for (ApiDto.ApiQueryParameterDto queryParam : api.queryParameters()) {
                    markdownBuilder.append("| ").append(queryParam.paramKey()).append(queryParam.isRequired() ? " *" : "").append(" | ")
                        .append(queryParam.paramValue()).append(" | ")
                        .append(queryParam.description()).append(" |\n");
                }
            } else {
                markdownBuilder.append("_No query parameters available._\n\n");
            }
            markdownBuilder.append("\n");

            // Headers
            markdownBuilder.append("### Headers\n");
            if (!api.headers().isEmpty()) {
                markdownBuilder.append("| Header Key | Header Value | Description |\n");
                markdownBuilder.append("|------------|-------------|-------------|\n");
                for (ApiDto.ApiHeaderDto header : api.headers()) {
                    markdownBuilder.append("| ").append(header.headerKey()).append(header.isRequired() ? " *" : "").append(" | ")
                        .append(header.headerValue()).append(" | ")
                        .append(header.description()).append(" |\n");
                }
            } else {
                markdownBuilder.append("_No headers available._\n\n");
            }
            markdownBuilder.append("\n");

            // Cookies
            markdownBuilder.append("### Cookies\n");
            if (!api.cookies().isEmpty()) {
                markdownBuilder.append("| Cookie Key | Cookie Value | Description |\n");
                markdownBuilder.append("|------------|--------------|-------------|\n");
                for (ApiDto.ApiCookieDto cookie : api.cookies()) {
                    markdownBuilder.append("| ").append(cookie.cookieKey()).append(cookie.isRequired() ? " *" : "").append(" | ")
                        .append(cookie.cookieValue()).append(" | ")
                        .append(cookie.description()).append(" |\n");
                }
            } else {
                markdownBuilder.append("_No cookies available._\n\n");
            }
            markdownBuilder.append("\n");

            if (api.bodyType().getValue().equals("JSON")) {
                markdownBuilder.append("### Request Body (JSON)\n");
                for (ApiDto.ApiBodyDto body : api.bodies()) {
                    if (body.parameterType().getValue().equals("JSON")) {
                        markdownBuilder.append("```json\n").append(body.bodyValue()).append("\n```");
                    }
                }
                markdownBuilder.append("\n");
            } else if (api.bodyType().getValue().equals("FORM_DATA")) {
                markdownBuilder.append("### Request Body (Form Data)\n");
                markdownBuilder.append("| Key | Type | Value | Description |\n");
                markdownBuilder.append("|-----|------|-------|-------------|\n");
                for (ApiDto.ApiBodyDto body : api.bodies()) {
                    markdownBuilder.append("| ").append(body.bodyKey()).append(body.isRequired() ? " *" : "").append(" | ")
                        .append(body.parameterType().getValue()).append(" | ")
                        .append(body.bodyValue()).append(" | ")
                        .append(body.description()).append(" |\n");
                }
                markdownBuilder.append("\n");
            } else {
                markdownBuilder.append("### Request Body\n");
                markdownBuilder.append("_No request body available._\n\n");
            }

            // Response Section
            markdownBuilder.append("---\n\n");
            markdownBuilder.append("## Response\n\n");
            for (ApiDto.ApiResponseDto response : api.responses()) {
                markdownBuilder.append("### ").append(response.code()).append(" ").append(response.description()).append("\n");
                markdownBuilder.append("```json\n").append(response.bodyData()).append("\n```");
            }

            return markdownBuilder.toString().getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new MainException(CustomException.FILE_PROCESSING_EXCEPTION);
        }
    }

    private String convertJsonToHighlightedHtml(String jsonStr) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(jsonStr, Object.class);
            String prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);

            prettyJson = prettyJson.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");

            prettyJson = prettyJson.replaceAll(":\\s*\"(.*?)\"", ": <span class=\"json-string\">\"$1\"</span>")
                .replaceAll(":\\s*(\\d+)", ": <span class=\"json-number\">$1</span>")
                .replaceAll(":\\s*(true|false)", ": <span class=\"json-boolean\">$1</span>")
                .replaceAll(":\\s*(null)", ": <span class=\"json-null\">$1</span>");

            prettyJson = prettyJson.replaceAll("\"(\\w+)\"\\s*:", "<span class=\"json-key\">\"$1\":</span>");

            return "<pre>" + prettyJson + "</pre>";
        } catch (Exception e) {
            return jsonStr;
        }
    }

}
