// apps/web/src/app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactPayload {
  typeProjet: string;
  objectif: string;
  etat: string;
  budget: string;
  budgetLibre?: string;
  delai: string;
  nom: string;
  email: string;
  whatsapp: string;
  description: string;
  preference: 'email' | 'whatsapp' | 'peu_importe';
}

function buildSummary(data: ContactPayload) {
  const budgetAffiche =
    data.budget === 'Montant libre' && data.budgetLibre
      ? `Montant libre : ${data.budgetLibre} FCFA`
      : data.budget;

  return {
    text:
      `Nouvelle demande de projet — Thalès le Dev\n\n` +
      `Nom : ${data.nom}\n` +
      `Email : ${data.email}\n` +
      `WhatsApp : ${data.whatsapp}\n` +
      `Préférence de contact : ${data.preference}\n\n` +
      `Type de projet : ${data.typeProjet}\n` +
      `Objectif : ${data.objectif}\n` +
      `État actuel : ${data.etat}\n` +
      `Budget : ${budgetAffiche}\n` +
      `Délai souhaité : ${data.delai}\n\n` +
      `Description : ${data.description}`,
    html:
      `<h2>Nouvelle demande de projet — Thalès le Dev</h2>` +
      `<p><strong>Nom :</strong> ${data.nom}<br/>` +
      `<strong>Email :</strong> ${data.email}<br/>` +
      `<strong>WhatsApp :</strong> ${data.whatsapp}<br/>` +
      `<strong>Préférence de contact :</strong> ${data.preference}</p>` +
      `<p><strong>Type de projet :</strong> ${data.typeProjet}<br/>` +
      `<strong>Objectif :</strong> ${data.objectif}<br/>` +
      `<strong>État actuel :</strong> ${data.etat}<br/>` +
      `<strong>Budget :</strong> ${budgetAffiche}<br/>` +
      `<strong>Délai souhaité :</strong> ${data.delai}</p>` +
      `<p><strong>Description :</strong><br/>${data.description.replace(/\n/g, '<br/>')}</p>`,
  };
}

async function sendEmail(summary: { text: string; html: string }, data: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY manquant');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Thalès le Dev <onboarding@resend.dev>',
      to: ['thalesyaleckmiracle@gmail.com'],
      reply_to: data.email,
      subject: `Nouvelle demande de projet — ${data.nom}`,
      html: summary.html,
      text: summary.text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as ContactPayload;

    if (!data.nom || !data.email || !data.description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const summary = buildSummary(data);

    try {
      await sendEmail(summary, data);
    } catch (err) {
      console.error('Email non envoyé :', err);
      return NextResponse.json({ error: 'Envoi impossible pour le moment' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erreur API contact:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}