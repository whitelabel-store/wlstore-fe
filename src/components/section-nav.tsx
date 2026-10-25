import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface NavItem {
  key: string;
  label: string;
  href: string;
}

export interface SectionNavProps {
  /** Nome exibido à esquerda. */
  title: string;
  items: NavItem[];
  /** Chave do item da página atual (marca o item ativo). */
  active?: string;
}

/** Barra de navegação simples de uma área do app (ex.: painel do lojista). */
export function SectionNav({ title, items, active }: SectionNavProps) {
  return (
    <nav className="flex items-center gap-6 border-b bg-card px-6 py-3 text-sm">
      <span className="mr-auto font-heading text-base font-bold text-text">{title}</span>
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.key === active ? 'page' : undefined}
          className={cn(
            'rounded-sm px-2 py-1 transition-colors duration-120 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            item.key === active ? 'font-semibold text-brand-ink' : 'text-text-2',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
