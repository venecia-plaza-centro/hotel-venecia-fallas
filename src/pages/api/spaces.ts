import type { APIRoute } from 'astro';
import { getSpaces } from '../../lib/spaces';
import { handleError, cacheJson } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/spaces
 * Precio, aforo y días de cada espacio, al día. La página /espacios/ es
 * estática (se genera al desplegar), así que se consulta desde el navegador
 * para que lo que se enseña coincida siempre con Airtable y con lo que luego se
 * cobra, sin esperar a un nuevo despliegue.
 */
export const GET: APIRoute = async () => {
  try {
    const spaces = await getSpaces();
    return cacheJson(
      {
        ok: true,
        spaces: spaces.map((s) => ({
          number: s.number,
          capacity: s.capacity,
          price: s.price,
          priceByDay: s.priceByDay ?? {},
          days: s.days,
        })),
      },
      300,
      600,
    );
  } catch (e) {
    return handleError(e);
  }
};
