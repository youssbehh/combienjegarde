// Fonction serverless Vercel : confirme auprès de Stripe qu'une session de
// paiement a bien été réglée avant que le site ne génère le rapport PDF.
// Nécessite la variable d'environnement STRIPE_SECRET_KEY (jamais exposée au navigateur).

interface Requete {
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

interface Reponse {
  status: (code: number) => Reponse;
  setHeader: (nom: string, valeur: string) => void;
  json: (corps: unknown) => void;
}

interface SessionStripe {
  payment_status?: string;
  created?: number;
}

const FORMAT_SESSION = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;
/** Un lien de retour n'est valable que 24 h après le paiement. */
const VALIDITE_SECONDES = 24 * 60 * 60;

export default async function handler(req: Requete, res: Reponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.status(405).json({ paid: false });
    return;
  }

  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete) {
    res.status(503).json({ paid: false, error: 'paiement_non_configure' });
    return;
  }

  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : '';
  if (!FORMAT_SESSION.test(sessionId)) {
    res.status(400).json({ paid: false });
    return;
  }

  try {
    const reponseStripe = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${cleSecrete}` },
    });
    if (!reponseStripe.ok) {
      res.status(200).json({ paid: false });
      return;
    }

    const session = (await reponseStripe.json()) as SessionStripe;
    const recent = typeof session.created === 'number' && Date.now() / 1000 - session.created < VALIDITE_SECONDES;
    res.status(200).json({ paid: session.payment_status === 'paid' && recent });
  } catch {
    res.status(502).json({ paid: false });
  }
}
