'use client';

import { motion } from 'motion/react';
import {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
} from './PreviewLinkCard';

// -----------------------------------------------------------------------------
// 1. Données — tes liens réels
// -----------------------------------------------------------------------------
const socials = [
  {
    id: 1,
    href: 'https://www.facebook.com/thalesyaleck',
    label: 'Facebook',
    subtitle: 'Profil personnel',
    icon: '/img/facebook.png',
  },
  {
    id: 2,
    href: 'https://www.facebook.com/thalesledev/',
    label: 'Page Facebook',
    subtitle: 'Page pro',
    icon: '/img/facebook.png',
  },
  {
    id: 3,
    href: 'https://www.linkedin.com/in/thal%C3%A8s-yaleck-10bb43386',
    label: 'LinkedIn',
    subtitle: 'Profil professionnel',
    icon: '/img/linkedin.png',
  },
  {
    id: 4,
    href: 'https://github.com/Yaleck558',
    label: 'GitHub',
    subtitle: 'Mes projets & code',
    icon: '/img/github.png',
  },
  {
    id: 5,
    href: 'https://www.instagram.com/thalesledev',
    label: 'Instagram',
    subtitle: 'Coulisses & projets',
    icon: '/img/instagram.png',
  },
  {
    id: 6,
    href: 'https://www.tiktok.com/@thalesledev',
    label: 'TikTok',
    subtitle: 'Contenus courts',
    icon: '/img/tiktok.png',
  },
  {
    id: 7,
    href: 'https://wa.me/2290196171313',
    label: 'WhatsApp',
    subtitle: 'Discuter directement',
    icon: '/img/whatsapp.png',
  },
  {
    id: 8,
    href: 'tel:+2290196171313',
    label: 'Appel direct',
    subtitle: 'Me joindre par téléphone',
    icon: '/img/phone.png',
  },
];

// Largeur fixe et petite de chaque slide -> icônes très rapprochées
const SLIDE_WIDTH = 46;

// -----------------------------------------------------------------------------
// 3. Composant
// -----------------------------------------------------------------------------
function SocialContactsList() {
  const itemStyle = {
    width: SLIDE_WIDTH,
    minWidth: SLIDE_WIDTH,
    maxWidth: SLIDE_WIDTH,
  } as const;

  return (
    <div className="w-full select-none" style={{ marginTop: 96 }}>
      <div className="flex flex-wrap items-center gap-3 px-2 py-2">
        {socials.map((social) => {
          const isHttp = social.href.startsWith('http');

          return (
            <div
              key={social.id}
              className="flex items-center justify-center"
              style={itemStyle}
            >
              <PreviewLinkCard href={social.href}>
                <PreviewLinkCardTrigger
                  target={isHttp ? '_blank' : undefined}
                  rel={isHttp ? 'noopener noreferrer' : undefined}
                  className="block rounded-full"
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    className="flex items-center justify-center overflow-hidden rounded-full shadow-sm"
                    style={{
                      width: 34,
                      height: 34,
                      background: '#ffffff',
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={social.icon}
                      alt={social.label}
                      style={{
                        width: 18,
                        height: 18,
                        objectFit: 'contain',
                      }}
                    />
                  </motion.div>
                </PreviewLinkCardTrigger>

                <PreviewLinkCardContent side="top" sideOffset={10}>
                  <PreviewLinkCardImage alt={social.label} />
                </PreviewLinkCardContent>
              </PreviewLinkCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SocialContactsList };