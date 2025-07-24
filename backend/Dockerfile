# Build Stage
# Build stage
FROM maven:3.9.6-openjdk-17-slim AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy the built jar file from the builder stage
COPY --from=builder /app/target/CS308Project-0.0.1-SNAPSHOT.jar app.jar

# Expose the port (your app uses 8085)
EXPOSE 8085

# Run the application
CMD ["java", "-jar", "app.jar"]
