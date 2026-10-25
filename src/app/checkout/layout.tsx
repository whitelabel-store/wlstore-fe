import { StoreHeader } from '@/components/store-header';

export const metadata = {
  title: 'Carrinho | WLStore',
  description: 'Carrinho e finalização do pedido',
};

// Cabeçalho enxuto, sem busca nem menu: no checkout o foco é concluir a compra.
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader storeName="WLStore" />
      <div className="flex-1 border-t">{children}</div>
    </>
  );
}
