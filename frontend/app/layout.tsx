// frontend/app/layout.tsx
import "./globals.css";

export const metadata = { title: "SismoView – MVP" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0b1220] text-slate-100 antialiased">
        {/* Capas de fondo (se ven detrás de todo) */}
        <div className="bg-gradient-space"></div>
        <div className="stars"></div>
        <div className="space-vignette"></div>

        {children}
      </body>
    </html>
  );
}
