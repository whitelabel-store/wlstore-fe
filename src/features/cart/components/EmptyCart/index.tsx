import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

/** Estado vazio do carrinho, com o caminho de volta para a loja. */
export function EmptyCart() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border bg-card px-6 py-12 text-center">
      <ShoppingCartIcon aria-hidden className="size-12 text-text-3" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-text">Seu carrinho está vazio</h2>
        <p className="text-text-2">Os produtos que você adicionar aparecem aqui.</p>
      </div>
      <Link
        href="/"
        className="rounded-md bg-action px-5 py-2.5 font-semibold text-on-action transition-colors duration-120 hover:bg-action-hover"
      >
        Continuar comprando
      </Link>
    </section>
  );
}
