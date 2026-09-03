"use server";

export async function getHistoricalEvents(day: number, monthName: string, currentYear: number) {
  try {
    const title = encodeURIComponent(`Wikipedie:Vybraná_výročí_dne/${day}._${monthName}`);
    const url = `https://cs.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${title}&format=json&explaintext=true`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Failed to fetch from Wikipedia");
    
    const data = await response.json();
    if (data.query && data.query.pages) {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      
      if (extract) {
        const lines = extract.split('\n').filter((l: string) => l.trim() !== '');
        const parsedEvents: { year: string; text: string; yearsAgo: number }[] = [];

        lines.forEach((line: string) => {
          const match = line.match(/^(\d{1,4})\s*(?:–|-)\s*(.*)/);
          if (match) {
            const yearStr = match[1];
            const text = match[2];
            const yearNum = parseInt(yearStr, 10);
            const yearsAgo = currentYear - yearNum;
            
            parsedEvents.push({ year: yearStr, text, yearsAgo });
          }
        });
        
        parsedEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        return parsedEvents;
      }
    }
    return [];
  } catch (error) {
    console.error("Server Action fetch error:", error);
    return [];
  }
}
