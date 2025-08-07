#FROM tabatad/jdk21:latest
FROM eclipse-temurin:24
LABEL authors="Mariem"


COPY /target/backend-0.0.1-SNAPSHOT.jar /
WORKDIR /

#Uncomment to run without tracing
#ENTRYPOINT ["java", "-jar", "target/notes-0.0.1-SNAPSHOT.jar"]
#EXPOSE 8081
EXPOSE 8080
#Uncomment to run with tracing
ENTRYPOINT ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
