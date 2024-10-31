FROM openjdk:17-jdk-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl
COPY build/libs/sapi-0.0.1-SNAPSHOT.jar /app/sapi.jar
ENTRYPOINT ["java", "-jar", "/app/sapi.jar"]