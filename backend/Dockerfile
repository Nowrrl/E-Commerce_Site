# Use a JDK image for Spring Boot
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Spring Boot JAR (adjust name as needed)
COPY target/*.jar app.jar

# Expose port
EXPOSE 8085

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
