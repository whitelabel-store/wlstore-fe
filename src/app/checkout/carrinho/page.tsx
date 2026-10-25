import { EmptyCart } from '../../../features/cart/components/EmptyCart';

// Esqueleto: o carrinho de verdade vem do order-service, quando ele tiver os
// endpoints. Até lá a página mostra o estado vazio.
const CartPage = () => {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-bold text-text">Seu carrinho</h1>
      <EmptyCart />
    </main>
  );
};

export default CartPage;
