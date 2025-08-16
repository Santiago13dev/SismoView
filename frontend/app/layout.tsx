import './globals.css';
export const metadata = { title: 'SismoView', description: 'Visualizador educativo' };
export default function RootLayout({ children }:{children: React.ReactNode}) {
  return <html lang="es"><body className="bg-slate-950 text-slate-100">{children}</body></html>;
}
