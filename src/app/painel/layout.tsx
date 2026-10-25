import { SectionNav } from '@/components/section-nav';

export const metadata = {
  title: 'Painel do lojista | WLStore',
  description: 'Gestão de preços da loja',
};

const NAV_ITEMS = [
  { key: 'loja', label: 'Ver a loja', href: '/' },
  { key: 'precos', label: 'Preços', href: '/painel' },
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionNav title="Painel do lojista" items={NAV_ITEMS} active="precos" />
      {children}
    </>
  );
}
