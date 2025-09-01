
# Backend — SismoView (Spring Boot 3.3)

## Requisitos
- Java 21+ (probado con Java 24)
- Gradle 8.9+ (wrapper incluido)

## Ejecutar en local
```bash
./gradlew bootRun
# Windows:
# .\gradlew.bat bootRun
```

## Build + Calidad
```bash
./gradlew clean checkstyleMain checkstyleTest build
```

## Endpoints
- `POST /api/simulate/seismic`
- `POST /api/simulate/tsunami`

### DTOs relevantes
- `SeismicRequest{ lat, lon, depthKm, magnitude, cities[] }`
- `SeismicResponse{ rings{p[],s[]}, arrivals[], intensity{levels[], legend[]} }`
- `TsunamiResponse{ legend[], grid? }` *(placeholder segun versión)*
- `Arrival{ city, phase('P'|'S'), minutes }`
- `RingSegment{ centerLat, centerLon, bearingDeg, distanceKm }`
- `LegendItem{ label, color }`
- `IntensityResult{ levels[], legend[] }`

## CORS
`WebConfig` habilita `http://localhost:3000` y `https://*` sobre `/api/**`.

## Empaquetado
```bash
./gradlew build
java -jar build/libs/sismoview-backend-*.jar
```
