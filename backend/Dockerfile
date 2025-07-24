# Use Maven with JDK 17 (official image)
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Build the application (skip tests)
RUN mvn clean package -DskipTests

# Use a lightweight runtime image for running the jar
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar file from the builder stage
COPY --from=builder /app/target/CS308Project-0.0.1-SNAPSHOT.jar app.jar

# Expose the port (your app uses 8085)
EXPOSE 8085

# Run the application
CMD ["java", "-jar", "app.jar"]
