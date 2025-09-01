
# Frontend — SismoView (Next.js 14)

## Requisitos
- Node.js 18 o 20 LTS
- npm 9+

## Instalación y arranque
```bash
cp .env.example .env.local  # si no existe
# .env.local debe contener:
# NEXT_PUBLIC_API_BASE=http://localhost:8080

npm i
npm run dev
```
Abre http://localhost:3000

## Producción
```bash
npm run build
npm start           # sirve la build en 3000
```

## Texturas del globo
Coloca estos archivos en `public/textures/`:

- `earth_political_4k.jpg`  (principal)
- `earth_normal_2k.jpg`     (opcional)
- `earth_specular_2k.jpg`   (opcional)

> Se acceden como `/textures/earth_political_4k.jpg`, etc.

## Paquetes clave
- `three`, `@react-three/fiber`, `@react-three/drei`
- `tailwindcss`

Si hay problemas de compatibilidad, alinea versiones entre **three/fiber/drei**.
