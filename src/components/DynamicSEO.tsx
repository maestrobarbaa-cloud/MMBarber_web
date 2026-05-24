"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

/**
 * Dynamic SEO Engine
 * Nahrazuje statický keyword stuffing rotujícím přirozeným obsahem a Schema.org daty.
 * Tím Googlu ukazuje, že web žije a obsah dává smysl lidem i vyhledávačům.
 */
export function DynamicSEO() {
  const [mounted, setMounted] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Dynamicky rotuje obsah podle týdne v roce, aby Google viděl změny
    const d = new Date();
    const startDate = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    setCurrentVariant(weekNumber % 3); // Máme 3 varianty textu
  }, []);

  // Schema.org data pro LocalBusiness a Reviews
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": "MMBARBER",
    "image": "https://mmbarber.cz/logo.png",
    "@id": "https://mmbarber.cz",
    "url": "https://mmbarber.cz",
    "telephone": "+420577544073",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sadová 1383",
      "addressLocality": "Uherské Hradiště",
      "postalCode": "68605",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.0683,
      "longitude": 17.4764
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "124"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaký je nejlepší barbershop v Uherském Hradišti?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MMBARBER v Mařaticích je špičkou díky kombinaci precizních střihů, skin fade technik a pohodlného parkování zdarma. Zakládáme si na kvalitě a detailech."
        }
      },
      {
        "@type": "Question",
        "name": "Jak se mohu objednat na střih?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejrychleji se k nám objednáte přes náš online rezervační systém na is.mmbarber.cz, kde ihned vidíte dostupné termíny."
        }
      }
    ]
  };

  const variants = [
    "Moderní péče o vzhled muže se neobejde bez precizního střihu. Náš tým v Mařaticích se specializuje na perfektní přechody, takzvaný skin fade, a klasické úpravy vousů metodou horkého ručníku. Kvalita, čistota a pohodové prostředí jsou u nás vždy na prvním místě. Nejsme jen holičství, jsme místo, kde si odpočinete.",
    "Zastavte se za námi na profesionální pánský střih a úpravu vousů. Naše lokalita nabízí výbornou dostupnost z celého regionu Slovácka, s garantovaným parkováním přímo u vchodu. Pracujeme s prémiovou kosmetikou a zaručujeme, že od nás odejdete stoprocentně spokojení a odpočatí.",
    "Styl, preciznost a jedinečná atmosféra. Každému klientovi věnujeme maximální pozornost. Ať už hledáte moderní buzzcut, texturovaný crop top nebo tradiční byznys střih, naši odborníci vám poradí. K tomu kvalitní káva a příjemný relax – to je náš standard."
  ];

  if (!mounted) return null;

  return (
    <>
      <Script id="seo-local-business" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Script id="seo-faq-page" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* 
        Dynamický rotující obsah skrytý pro uživatele, viditelný pro Google.
        Rotuje podle týdne v roce, takže Google při procházení vidí, že web žije.
      */}
      <div className="sr-only" aria-hidden="true">
        <h2>MMBARBER Uherské Hradiště: Pánský střih a úprava vousů</h2>
        <p>{variants[currentVariant]}</p>
        <p>{variants[(currentVariant + 1) % 3]}</p>
        <p>Garantujeme bezproblémové parkování zdarma přímo před salonem v Mařaticích. Váš prémiový barbershop v srdci Slovácka.</p>
      </div>
    </>
  );
}
