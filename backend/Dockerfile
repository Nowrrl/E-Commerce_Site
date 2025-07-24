# Use official Maven image with Java 17
FROM maven:3.8.6-openjdk-17-slim

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Grant permission
RUN chmod +x mvnw

# Build the project (skip tests)
RUN ./mvnw package -DskipTests

# Expose port
EXPOSE 8085

# Run the Spring Boot app
CMD ["./mvnw", "spring-boot:run"]
