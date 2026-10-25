import { redirect } from 'next/navigation';

// /checkout leva direto ao carrinho.
export default function CheckoutHome() {
  redirect('/checkout/carrinho');
}
