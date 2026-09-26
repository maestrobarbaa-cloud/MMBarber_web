import { Metadata } from 'next';
import ArsenalClient from './ArsenalClient';

export const metadata: Metadata = {
  title: 'Arzenál | MMBarber',
  description: 'Hodnocení našeho barber vybavení. Zjisti, s jakými nástroji pracujeme a jak si vedou v našem tier listu.',
};

export default function ArsenalPage() {
  return <ArsenalClient />;
}
