import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');
dotenv.config({ path: envPath });

const app = express();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

if (!stripeSecretKey) {
  console.error('❌ Falta STRIPE_SECRET_KEY en el archivo .env');
}

app.use(cors({ origin: true }));
app.use(express.json());

// ─── POST /crear-checkout-session ────────────────────────────────────────────
app.post('/crear-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Falta STRIPE_SECRET_KEY en el archivo .env.' });
  }

  const { items, codigoFactura, frontendOrigin } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No se recibieron tareas.' });
  }

  const origenFrontend = typeof frontendOrigin === 'string' && frontendOrigin.startsWith('http')
    ? frontendOrigin
    : 'http://localhost:5173';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: codigoFactura, // FAC-xxxxxx visible en el dashboard de Stripe
      mode: 'payment',

      line_items: items.map((tarea) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: tarea.titulo,
            description: `${tarea.horas}h × ${tarea.precio}€/h`,
          },
          unit_amount: Math.round(Number(tarea.total) * 100), // Stripe trabaja en céntimos
        },
        quantity: 1,
      })),

      success_url: `${origenFrontend}/tareas?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origenFrontend}/tareas?payment=cancelled`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('Error creando sesión de Stripe:', error.message);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago.' });
  }
});

// ─── GET /verificar-pago?session_id=xxx ──────────────────────────────────────
// Opcional: llamar desde la vista /pago-exitoso para confirmar el pago
app.get('/verificar-pago', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Falta STRIPE_SECRET_KEY en el archivo .env.' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Falta session_id.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json({
      estado:        session.payment_status,   // 'paid' | 'unpaid' | 'no_payment_required'
      codigoFactura: session.client_reference_id,
      total:         session.amount_total / 100,
      moneda:        session.currency.toUpperCase(),
    });
  } catch (error) {
    console.error('Error verificando pago:', error.message);
    res.status(500).json({ error: 'No se pudo verificar el pago.' });
  }
});

// ─── Arranque ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));