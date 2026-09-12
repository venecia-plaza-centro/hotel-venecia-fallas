/**
 * Pago con Stripe Checkout (tarjeta + Bizum). La reserva NO se crea en
 * Airtable hasta que el pago se confirma: no se "solicita" nada, lo que el
 * cliente reserva son habitaciones que el sistema ya muestra como libres, así
 * que pagar es lo que confirma la reserva (ver /api/stripe-webhook).
 *
 * Sin STRIPE_SECRET_KEY la web cae a un modo de demostración: /api/checkout
 * crea la reserva directamente (como en Hito 2) sin pasar por ningún cobro
 * real, para poder probar el flujo entero sin cuenta de Stripe.
 */
import Stripe from 'stripe';

const SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY;
export const WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;

export function stripeEnabled(): boolean {
  return Boolean(SECRET_KEY);
}

let client: Stripe | null = null;

/** Cliente de Stripe. Lanza si se llama sin STRIPE_SECRET_KEY: comprobar
 *  `stripeEnabled()` antes. */
export function getStripe(): Stripe {
  if (!SECRET_KEY) throw new Error('STRIPE_SECRET_KEY no configurada');
  client ??= new Stripe(SECRET_KEY);
  return client;
}
