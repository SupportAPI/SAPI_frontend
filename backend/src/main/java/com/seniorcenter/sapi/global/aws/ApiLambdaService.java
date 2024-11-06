package com.seniorcenter.sapi.global.aws;

import com.seniorcenter.sapi.domain.api.domain.*;
import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.domain.api.domain.enums.HttpMethod;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.apigatewayv2.ApiGatewayV2Client;
import software.amazon.awssdk.services.apigatewayv2.model.*;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.*;
import software.amazon.awssdk.services.lambda.model.Runtime;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ApiLambdaService {

    private final ApiRepository apiRepository;
    private final SpecificationRepository specificationRepository;

    private final TemplateEngine templateEngine;
    private final LambdaClient lambdaClient;
    private final ApiGatewayV2Client apiGatewayV2Client;

    @Value("${cloud.aws.lambda.account-id}")
    private String awsAccountId;
    @Value("${cloud.aws.lambda.role}")
    private String awsLambdaRole;
    @Value("${cloud.aws.lambda.region}")
    private Region region;


    // Lambda 함수 생성 및 설정
    @Transactional
    public void createLambda(UUID specificationId) {
        Specification specification = specificationRepository.findById(specificationId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Api confirmedApi = apiRepository.findById(specification.getConfirmedApiId());

        // 최초 생성 여부 확인
        if(specification.getApiGatewayId().isEmpty()) {
            // API Gateway 생성
            String apiGatewayId = createApiGateway(specification);
            specification.updateApiGatewayId(apiGatewayId);
        } else {
            // 생성된 람다가 있을 경우 람다 삭제
            deleteLambdaFunction(specification);
        }

        // Lambda 함수 생성
        String lambdaArn = createLambdaFunction(confirmedApi);

        // API Gateway 와 Lambda 연결
        integrateLambdaWithApiGateway(specification, lambdaArn, confirmedApi.getMethod());
    }

    // Lambda 함수를 생성하는 로직
    private String createLambdaFunction(Api api) {

        // Lambda 코드 작성
        String lambdaFunctionCode = generateLambdaCode(api);

        // LambdaClient를 통해 함수 생성
        ByteArrayOutputStream baos = createZip(lambdaFunctionCode);

        CreateFunctionRequest request = CreateFunctionRequest.builder()
                .functionName(api.getSpecification().getId().toString())
                .runtime(Runtime.NODEJS18_X)
                .role(String.format("arn:aws:iam::%s:role/%s", awsAccountId, awsLambdaRole))
                .handler("index.handler")
                .code(FunctionCode.builder().zipFile(SdkBytes.fromByteArray(baos.toByteArray())).build())
                .build();

        CreateFunctionResponse response = lambdaClient.createFunction(request);
        return response.functionArn();
    }

    // Thymeleaf 템플릿 엔진을 사용해 Lambda 코드를 생성
    private String generateLambdaCode(Api api) {
        Context context = new Context();

        List<ApiHeader> headers = api.getHeaders() != null ? api.getHeaders() : List.of();
        context.setVariable("headers", headers);

        List<ApiCookie> cookies = api.getCookies() != null ? api.getCookies() : null;
        context.setVariable("cookies", cookies);

        List<ApiQueryParameter> queryParams = api.getQueryParameters() != null ? api.getQueryParameters() : List.of();
        context.setVariable("queryParams", queryParams);

        List<ApiBody> formData = api.getBodies() != null ?
                api.getBodies().stream()
                        .filter(apiBody -> {
                            if (api.getBodyType() == BodyType.JSON) {
                                return apiBody.getParameterType() == ParameterType.JSON;
                            } else if (api.getBodyType() == BodyType.FORM_DATA) {
                                return apiBody.getParameterType() == ParameterType.TEXT
                                        || apiBody.getParameterType() == ParameterType.FILE;
                            }
                            return false;
                        })
                        .collect(Collectors.toList())
                : List.of();
        context.setVariable("formData", formData);

        ApiResponse http2xxResponse = api.getResponses() != null
                ? api.getResponses().stream()
                .filter(response -> response.getCode() >= 200 && response.getCode() < 300)
                .findFirst()
                .orElse(null)
                : null;

        String responseData = (http2xxResponse != null) ? http2xxResponse.getBodyData() : null;
        if (responseData != null)
            context.setVariable("responseData", responseData);

        return templateEngine.process("lambdaFunctionTemplate", context);
    }

    // Lambda 코드 압축 (ZIP으로 변환)
    private ByteArrayOutputStream createZip(String lambdaFunctionCode) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            ZipEntry entry = new ZipEntry("index.js");
            zos.putNextEntry(entry);
            zos.write(lambdaFunctionCode.getBytes());
            zos.closeEntry();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return baos;
    }

    // API Gateway V2 설정 및 Lambda 연결
    private String createApiGateway(Specification specification) {
        // HTTP API 생성
        CreateApiRequest createApiRequest = CreateApiRequest.builder()
                .name(specification.getId().toString())
                .protocolType(ProtocolType.HTTP)
                .build();

        CreateApiResponse apiResponse = apiGatewayV2Client.createApi(createApiRequest);

        String apiGatewayId = apiResponse.apiId();

        // 스테이지 생성
        CreateStageRequest createStageRequest = CreateStageRequest.builder()
                .apiId(apiGatewayId)
                .stageName("$default")
                .autoDeploy(true) // 자동 배포 설정
                .build();

        apiGatewayV2Client.createStage(createStageRequest);

        return apiGatewayId;
    }

    public void integrateLambdaWithApiGateway(Specification specification, String lambdaArn, HttpMethod httpMethod) {
        // Lambda와 API Gateway 통합
        CreateIntegrationRequest integrationRequest = CreateIntegrationRequest.builder()
                .apiId(specification.getApiGatewayId())
                .integrationType(IntegrationType.AWS_PROXY)
                .integrationUri(lambdaArn)
                .payloadFormatVersion("2.0")
                .build();

        CreateIntegrationResponse integrationResponse = apiGatewayV2Client.createIntegration(integrationRequest);

        // 라우트 생성
        CreateRouteRequest createRouteRequest = CreateRouteRequest.builder()
                .apiId(specification.getApiGatewayId())
                .routeKey(httpMethod + " /")
                .target("integrations/" + integrationResponse.integrationId())
                .build();

        apiGatewayV2Client.createRoute(createRouteRequest);

        // Lambda에 API Gateway 호출 권한 부여
        addLambdaPermission(lambdaArn, specification.getApiGatewayId());
    }


    private void addLambdaPermission(String lambdaArn, String apiId) {
        String apiGatewayArn = String.format("arn:aws:execute-api:%s:%s:%s/*", region.id(), awsAccountId, apiId);

        AddPermissionRequest addPermissionRequest = AddPermissionRequest.builder()
                .functionName(lambdaArn)
                .statementId("apigateway-" + apiId)
                .action("lambda:InvokeFunction")
                .principal("apigateway.amazonaws.com")
                .sourceArn(apiGatewayArn)
                .build();

        lambdaClient.addPermission(addPermissionRequest);
    }

    private void deleteLambdaFunction(Specification specification) {
        // API Gateway에서 라우트 삭제
        GetRoutesRequest getRoutesRequest = GetRoutesRequest.builder()
                .apiId(specification.getApiGatewayId())
                .build();
        GetRoutesResponse routesResponse = apiGatewayV2Client.getRoutes(getRoutesRequest);

        routesResponse.items().forEach(route -> {
            DeleteRouteRequest deleteRouteRequest = DeleteRouteRequest.builder()
                    .apiId(specification.getApiGatewayId())
                    .routeId(route.routeId())
                    .build();
            apiGatewayV2Client.deleteRoute(deleteRouteRequest);
        });

        // API Gateway에서 통합 가져오기 및 삭제
        GetIntegrationsRequest getIntegrationsRequest = GetIntegrationsRequest.builder()
                .apiId(specification.getApiGatewayId())
                .build();
        GetIntegrationsResponse integrationsResponse = apiGatewayV2Client.getIntegrations(getIntegrationsRequest);

        integrationsResponse.items().forEach(integration -> {
            DeleteIntegrationRequest deleteIntegrationRequest = DeleteIntegrationRequest.builder()
                    .apiId(specification.getApiGatewayId())
                    .integrationId(integration.integrationId())
                    .build();
            apiGatewayV2Client.deleteIntegration(deleteIntegrationRequest);
        });

        // Lambda 함수 삭제
        DeleteFunctionRequest deleteFunctionRequest = DeleteFunctionRequest.builder()
                .functionName(specification.getId().toString())
                .build();
        lambdaClient.deleteFunction(deleteFunctionRequest);
    }
}
