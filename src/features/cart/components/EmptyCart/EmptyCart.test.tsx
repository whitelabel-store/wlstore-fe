import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyCart } from '.';

describe('EmptyCart', () => {
  it('avisa que o carrinho está vazio', () => {
    render(<EmptyCart />);

    expect(screen.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeTruthy();
  });

  it('leva de volta para a loja (/)', () => {
    render(<EmptyCart />);

    expect(screen.getByRole('link', { name: 'Continuar comprando' }).getAttribute('href')).toBe('/');
  });
});
