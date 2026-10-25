import { QueryProvider } from '@/components/providers/query-provider';
import { fontVariables } from '@/lib/fonts';
import '../styles/globals.css';

export const metadata = {
  title: 'WLStore',
  description: 'Loja WLStore',
};

// Layout raiz: só o que é comum a todas as áreas (fontes, tema, React
// Query). Cada área (loja, painel, checkout) tem o seu layout com cabeçalho.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="flex min-h-screen flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
