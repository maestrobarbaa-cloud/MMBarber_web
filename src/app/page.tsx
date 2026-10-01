import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const nation = searchParams.nation as string;
  const vip = searchParams.vip as string;

  const activeMode = (nation || vip || '').toLowerCase();

  if (activeMode === 'investor') {
    return {
      title: 'MMBARBER | VIP Investor Mode',
      description: 'Join the Elite. Return on Investment. Next-Gen Franchise.',
      openGraph: {
        title: 'MMBARBER | VIP Investor Mode',
        description: 'Join the Elite. Return on Investment. Next-Gen Franchise.',
      },
      twitter: {
        title: 'MMBARBER | VIP Investor Mode',
        description: 'Join the Elite. Return on Investment. Next-Gen Franchise.',
      }
    };
  }

  if (activeMode === 'it') {
    return {
      title: 'MMBARBER | La Dolce Vita',
      description: 'Passione e Stile. Elegante barbershop in Repubblica Ceca.',
      openGraph: {
        title: 'MMBARBER | La Dolce Vita',
        description: 'Passione e Stile. Elegante barbershop in Repubblica Ceca.',
      },
    };
  }

  if (activeMode === 'usa') {
    return {
      title: 'MMBARBER | American Dream',
      description: 'The Ultimate Barber Experience. Book Now.',
      openGraph: {
        title: 'MMBARBER | American Dream',
        description: 'The Ultimate Barber Experience. Book Now.',
      },
    };
  }
  
  if (activeMode === 'de') {
    return {
      title: 'MMBARBER | Meisterklasse',
      description: 'Präzision und Stil. Reservieren Sie noch heute.',
      openGraph: {
        title: 'MMBARBER | Meisterklasse',
        description: 'Präzision und Stil. Reservieren Sie noch heute.',
      },
    };
  }
  
  if (activeMode === 'ca') {
    return {
      title: 'MMBARBER | True North Strong',
      description: 'Canadian Pride in Grooming. Book Now.',
      openGraph: {
        title: 'MMBARBER | True North Strong',
        description: 'Canadian Pride in Grooming. Book Now.',
      },
    };
  }
  
  if (activeMode === 'uk') {
    return {
      title: 'MMBARBER | Royal Elegance',
      description: 'God Save The King. Classic British Gentlemen Grooming.',
      openGraph: {
        title: 'MMBARBER | Royal Elegance',
        description: 'God Save The King. Classic British Gentlemen Grooming.',
      },
    };
  }
  
  if (activeMode === 'es') {
    return {
      title: 'MMBARBER | Pasión y Estilo',
      description: 'Viva la Vida. Pura elegancia.',
      openGraph: {
        title: 'MMBARBER | Pasión y Estilo',
        description: 'Viva la Vida. Pura elegancia.',
      },
    };
  }

  // Fallback to layout.tsx defaults if no special mode is active
  return {};
}

export default function Page() {
  return <HomePageClient />;
}
