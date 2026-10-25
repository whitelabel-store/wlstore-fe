import { StoreFooter } from '@/components/store-footer';
import { StoreHeader } from '@/components/store-header';
import { CategoryMenu } from '../../features/category-navigation/components/CategoryMenu';

// Nome, aviso e links fixos por enquanto; depois vêm da configuração da loja
// (tenant).
const STORE_NAME = 'WLStore';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader
        storeName={STORE_NAME}
        announcement="Frete grátis em compras acima de R$ 199 · Parcele em até 10x sem juros"
        search={{ action: '/', placeholder: 'Buscar produtos, marcas e categorias' }}
      >
        <CategoryMenu />
      </StoreHeader>
      <div className="flex-1">{children}</div>
      <StoreFooter
        storeName={STORE_NAME}
        columns={[
          {
            title: 'Comprar',
            links: [
              { label: 'Novidades', href: '/' },
              { label: 'Ofertas', href: '/?ofertas=true' },
              { label: 'Carrinho', href: '/checkout/carrinho' },
            ],
          },
          {
            title: 'Para lojistas',
            links: [{ label: 'Painel do lojista', href: '/painel' }],
          },
        ]}
      />
    </>
  );
}
