# Multi-stage build para optimizar el tamaño de la imagen final
FROM eclipse-temurin:21-jdk AS build

# Configurar variables de entorno para optimizar Gradle
ENV GRADLE_OPTS="-Dorg.gradle.daemon=false -Dorg.gradle.parallel=true"

WORKDIR /app

# Copiar archivos de configuración primero (para aprovechar el cache de Docker)
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle/ gradle/
COPY gradlew gradlew.bat ./

# Dar permisos de ejecución al wrapper de Gradle
RUN chmod +x gradlew

# Descargar dependencias (se cachea si no cambian los archivos de configuración)
RUN ./gradlew dependencies --no-daemon

# Copiar el código fuente
COPY src/ src/
COPY config/ config/

# Construir la aplicación
RUN ./gradlew build -x test --no-daemon

# Imagen final optimizada
FROM eclipse-temurin:21-jre-jammy

# Crear usuario no-root para seguridad
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copiar solo el JAR compilado
COPY --from=build /app/build/libs/*.jar /app/sismoview-backend.jar

# Cambiar ownership al usuario no-root
RUN chown -R appuser:appuser /app

# Cambiar al usuario no-root
USER appuser

# Configurar JVM para contenedores
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"

# Exponer puerto
EXPOSE 8080

# Healthcheck para Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Punto de entrada optimizado
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/sismoview-backend.jar"]
