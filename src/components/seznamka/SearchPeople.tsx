import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Loader2 } from 'lucide-react';
import { UserSearchCard } from '@/components/seznamka/UserSearchCard';

export function SearchPeople() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const url = new URL('/api/seznamka/search', window.location.origin);
      url.searchParams.append('q', searchQuery);
      if (session?.user?.id) {
        url.searchParams.append('userId', session.user.id);
      }
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Chyba při vyhledávání:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest mb-6">
          Hledat v síti
        </h3>
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Hledat podle jména, příjmení nebo přezdívky..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/60 border border-mafia-gold/30 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-mafia-gold transition-colors font-mono"
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Loader2 size={20} className="text-mafia-gold animate-spin" />
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {query.trim().length > 2 && results.length === 0 && !loading && (
            <div className="text-center py-12 text-white/40 font-mono">
              Nikdo nenalezen. Zkuste jiné jméno.
            </div>
          )}
          
          {results.map((user) => (
            <UserSearchCard 
              key={user.userId} 
              user={user} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
