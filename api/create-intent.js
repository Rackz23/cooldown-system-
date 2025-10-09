// /api/create-intent.js  (Vercel serverless function)
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { product } = body;

    // Prices in cents
    const priceMap = { starter: 1997, full: 2897 };
    const amount = priceMap[product] ?? 1997;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { product }
    });

    res.status(200).json({ clientSecret: intent.client_secret });
  } catch (e) {
    res.status(500).json({ error: 'stripe_error' });
  }
}
