FROM openjdk:17-oracle
EXPOSE 80
ARG JAR_FILE=build/libs/conceptual-pipeline-demo-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]