import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionNav } from './section-nav';

const items = [
  { key: 'vitrine', label: 'Loja', href: '/' },
  { key: 'painel', label: 'Painel do lojista', href: '/painel' },
];

describe('SectionNav', () => {
  it('mostra o título e um link por item, com o href informado', () => {
    render(<SectionNav title="WLStore" items={items} />);

    expect(screen.getByText('WLStore')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Loja' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'Painel do lojista' }).getAttribute('href')).toBe('/painel');
  });

  it('marca só o item ativo com aria-current', () => {
    render(<SectionNav title="WLStore" items={items} active="painel" />);

    expect(screen.getByRole('link', { name: 'Painel do lojista' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Loja' }).getAttribute('aria-current')).toBeNull();
  });
});
