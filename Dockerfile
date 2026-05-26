# Stage 1: Build (Maven + Node inside Docker — no local installs needed)
# Using non-alpine variants for ARM64 (Apple Silicon) + AMD64 compatibility
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy frontend first (maven plugin needs it)
COPY frontend/ frontend/

# Copy backend
COPY backend/pom.xml backend/
COPY backend/src backend/src/

# Build: downloads Node, builds React, packages fat JAR
RUN cd backend && mvn clean package -DskipTests -q

# Stage 2: Runtime (lean JRE only)
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /app/backend/target/shopzone-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
