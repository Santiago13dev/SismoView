
# SismoView — Monorepo (Backend + Frontend)

Pagina web para visualizar simulaciones sísmicas y de tsunami en un **globo 3D** con estadísticas en tiempo real.

> **Stack**
>
> - **Frontend:** Next.js 14 + React 18 + TailwindCSS + Three.js + @react-three/fiber + @react-three/drei  
> - **Backend:** Spring Boot 3.3 (Java 24, Gradle Kotlin DSL)  
> - **Formato API:** JSON (DTOs tipados)  
> - **CORS:** habilitado para `http://localhost:3000` por default

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Primer arranque rápido](#primer-arranque-rápido)
- [Frontend](#frontend)
- [Backend](#backend)
- [API](#api)
- [/api/simulate/seismic (POST)](#apisimulateseismic-post)
- [/api/simulate/tsunami (POST)](#apisimulatetsunami-post)
- [Despliegue](#despliegue)
- [Resolución de problemas](#resolución-de-problemas)
- [Licencia](#licencia)

---

## Arquitectura

```
sismoview/
├─ backend/                      # Spring Boot (Java 24, Gradle)
│  ├─ src/main/java/com/sismoview
│  │  ├─ adapters/rest/          # Controladores REST y DTOs
│  │  ├─ domain/                 # Modelos de dominio y puertos
│  │  ├─ service/                # Casos de uso (Seismic/Tsunami)
│  │  └─ config/                 # CORS, etc.
│  ├─ build.gradle.kts
│  └─ settings.gradle.kts
│
└─ frontend/                     # Next.js 14 + React + Three.js
   ├─ app/                       # App Router
   ├─ components/                # Globe.tsx, Stats.tsx, etc.
   ├─ public/textures/           # Imágenes del globo (político/normal/specular)
   ├─ .env.local                 # NEXT_PUBLIC_API_BASE=http://localhost:8080
   └─ package.json
```

---

## Requisitos

- **Java 21+ (Java 24 probado)** y **Gradle 8.9+** (wrapper incluido)  
- **Node.js 18 o 20 LTS** + **npm 9+**
- **Git**

> En Windows: PowerShell funciona bien para los comandos.

---

## Primer arranque rápido

1) **Backend** (puerto `8080`):
```bash
cd backend
./gradlew bootRun        # Windows: .\gradlew.bat bootRun
```
Verás en consola: `Tomcat started on port 8080` y `/actuator` expuesto.

2) **Frontend** (puerto `3000`):
```bash
cd frontend
cp .env.example .env.local   # (si no existe)
# asegúrate de que .env.local tenga:
# NEXT_PUBLIC_API_BASE=http://localhost:8080

npm i
npm run dev
```

3) Abre **http://localhost:3000**  
   - Ingresa lat/lon/magnitud y presiona **Simular**  
   - Verás el **globo 3D** con anillos P/S y el panel de **estadísticas** (arrivals / intensidad).

---

## Frontend

- **Rutas y componentes clave**
  - `app/page.tsx`: pantalla principal con formulario, layout y panel lateral.
  - `components/Globe.tsx`: escena de **Three.js** con:
    - `Canvas` de `@react-three/fiber`
    - `OrbitControls` de `@react-three/drei`
    - Texturas opcionales en `public/textures/`:
      - `earth_political_4k.jpg` (mapa político)
      - `earth_normal_2k.jpg` (normal map, opcional)
      - `earth_specular_2k.jpg` (specular mask, opcional)

- **Variables de entorno**
  - `NEXT_PUBLIC_API_BASE` → URL del backend (ej: `http://localhost:8080`)

- **Scripts**
```bash
npm run dev        # desarrollo (3000)
npm run build      # build producción
npm run start      # sirve la build (3000)
```

- **Nota Texturas**
  - Coloca las imágenes en `frontend/public/textures/` con los nombres indicados.
  - Acceso en runtime: `/textures/earth_political_4k.jpg` (Next sirve `public/` desde la raíz).

---

## Backend

- **Módulos principales**
  - `SismoViewBackendApplication` (Spring Boot)
  - `SeismicService` y `TsunamiService` (lógica de simulación)
  - `SismoController` (controlador REST)
  - DTOs en `adapters/rest/dto/*` (request/response)
  - Modelos en `domain/models/*`

- **Build / Calidad**
```bash
cd backend
./gradlew clean checkstyleMain checkstyleTest build
# JAR en build/libs/...
```

- **Run**
```bash
./gradlew bootRun
# o
java -jar build/libs/sismoview-backend-*.jar
```

- **CORS**
  - `WebConfig` habilita `http://localhost:3000` y `https://*` sobre `/api/**`.

---

## API

### `/api/simulate/seismic` (POST)

**Body** (JSON):
```jsonc
{
  "lat": 10.5,
  "lon": 166.3,
  "depthKm": 10,
  "magnitude": 6.3,
  "cities": [
    { "name": "Bogotá", "lat": 4.711, "lon": -74.0721 },
    { "name": "Tokio",  "lat": 35.6762, "lon": 139.6503 }
  ]
}
```

**Response**:
```jsonc
{
  "rings": {
    "p": [ /* RingSegment[]: {centerLat, centerLon, bearingDeg, distanceKm} */ ],
    "s": [ /* RingSegment[] */ ]
  },
  "arrivals": [
    { "city": "Bogotá", "phase": "P", "minutes": 36.2 },
    { "city": "Bogotá", "phase": "S", "minutes": 62.0 },
    { "city": "Tokio",  "phase": "P", "minutes": 9.7 },
    { "city": "Tokio",  "phase": "S", "minutes": 16.7 }
  ],
  "intensity": {
    "levels": [ /* number[] 1..8 */ ],
    "legend": [
      { "label": "1 Muy débil", "color": "#60a5fa" },
      { "label": "8 Extremo",   "color": "#ef4444" }
    ]
  }
}
```

### `/api/simulate/tsunami` (POST)

**Body** (JSON):
```jsonc
{
  "lat": 10.5,
  "lon": 166.3,
  "magnitude": 6.3
}
```

**Response**:
```jsonc
{
  "legend": [
    { "label": "0–1 m", "color": "#38bdf8" },
    { "label": "1–3 m", "color": "#22c55e" }
  ],
  "grid": { "cols": 360, "rows": 180 } // ejemplo/placeholder
}
```

> *Los nombres exactos de campos responden a los DTOs del backend (`SeismicRequest`, `SeismicResponse`, `TsunamiResponse`, `Arrival`, `RingSegment`, `IntensityResult`, `LegendItem`).*

---

## Despliegue

- **Frontend**: `npm run build` y servir `.next/` con `next start` o tu plataforma (Vercel).
- **Backend**: publicar el JAR en tu infraestructura (Docker/Cloud Run/EC2/etc).

**Docker compose (opcional y básico):**
```yaml
version: '3.9'
services:
  backend:
    build: ./backend
    ports: ["8080:8080"]
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_BASE: "http://backend:8080"
    depends_on: [backend]
```

---

## Resolución de problemas

- **Texturas 404**
  - Asegúrate de tener los archivos en `frontend/public/textures/` con el nombre correcto.
- **No rota/zooma el globo**
  - Comprueba que `OrbitControls` está montado y que el canvas no tiene un overlay encima.
- **Conflictos @react-three/drei / fiber / three**
  - Usa versiones compatibles. Recomendado: `three@0.160.x`, `@react-three/fiber@^9`, `@react-three/drei@^10`.
- **Checkstyle fallando**
  - Ejecuta `./gradlew checkstyleMain checkstyleTest` y corrige los archivos reportados en `backend/build/reports/checkstyle/`.
- **CORS**
  - Si cambias el origen del frontend, actualiza `WebConfig#addCorsMappings`.

---

## Licencia

Este repositorio es un ejemplo/MVP para fines educativos. Asegura que las texturas usadas respeten sus licencias de origen.
