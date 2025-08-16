# SismoView (MVP)

Monorepo educativo para visualizar propagación de **ondas P/S**, **intensidad** cualitativa y un esqueleto para **tsunami** con aguas someras.

## Pila
- **Backend**: Java 21, Spring Boot 3.3 (Web, Validation, Actuator), OpenAPI (springdoc), Gradle KTS, JUnit 5.
- **Frontend**: Next.js 14 (App Router, TS), React 18, Tailwind, TanStack Query, React Three Fiber (globo 3D), Recharts.
- **Infra**: Dockerfiles y `docker-compose.yml` para levantar local.
- **Fuentes de datos**: USGS GeoJSON para sismos (día/semana). Batimetría: mock.

## Arranque rápido (local)
```bash
# Backend
cd backend
# Requiere Java 21 y Gradle instalado localmente (o usa tu wrapper)
gradle build
java -jar build/libs/sismoview-backend-0.1.0.jar

# Frontend
cd ../frontend
npm ci
npm run dev
# abrir http://localhost:3000
```

## Docker Compose
```bash
docker compose up --build
# FE en http://localhost:3000  |  BE en http://localhost:8080
```

## Endpoints
- `POST /api/simulate/seismic`
- `POST /api/simulate/tsunami`
- `GET /api/live/earthquakes?window=day|week`
- `GET /actuator/health`
- Swagger: `/swagger-ui.html`

> Uso educativo. No apto para operación ni pronóstico.
