export function getVocative(name: string): string {
  if (!name || name.trim() === '') return '';

  const parts = name.trim().split(' ');
  // We'll just inflect the first word if there are multiple (e.g. "Karel Novák" -> "Karle Novák" is wrong, should be "Karle Nováku", but for nicknames people usually input just one word).
  // Actually, let's inflect just the first part for simplicity, or all parts if we want to be thorough. We will just inflect the first name for now.
  let firstName = parts[0];
  const rest = parts.slice(1).join(' ');

  let vocative = firstName;
  const lower = firstName.toLowerCase();
  
  if (lower.endsWith('a')) {
    vocative = firstName.slice(0, -1) + 'o';
  } else if (lower.endsWith('ek')) {
    // Radek -> Radku, Zdeněk -> Zdeňku (simplified)
    const base = firstName.slice(0, -2);
    // basic simplification for 'ěk'
    if (lower.endsWith('něk')) {
       vocative = firstName.slice(0, -3) + 'ňku';
    } else {
       vocative = base + 'ku';
    }
  } else if (lower.endsWith('k') || lower.endsWith('h') || lower.endsWith('g') || lower.endsWith('ch')) {
    vocative = firstName + 'u';
  } else if (lower.endsWith('r')) {
    if (lower === 'petr') vocative = 'Petře';
    else if (lower === 'alexandr') vocative = 'Alexandře';
    else vocative = firstName + 'e';
  } else if (lower.endsWith('š') || lower.endsWith('j') || lower.endsWith('c') || lower.endsWith('č') || lower.endsWith('ř') || lower.endsWith('s') || lower.endsWith('z')) {
    if (lower === 'tomas' || lower === 'tomáš') vocative = 'Tomáši';
    else if (lower === 'lukas' || lower === 'lukáš') vocative = 'Lukáši';
    else vocative = firstName + 'i';
  } else if (lower.endsWith('el')) {
    // Pavel -> Pavle, Karel -> Karle
    if (lower === 'pavel') vocative = 'Pavle';
    else if (lower === 'karel') vocative = 'Karle';
    else vocative = firstName + 'e';
  } else if (
    lower.endsWith('b') || lower.endsWith('d') || lower.endsWith('f') || lower.endsWith('l') || 
    lower.endsWith('m') || lower.endsWith('n') || lower.endsWith('p') || lower.endsWith('t') || lower.endsWith('v')
  ) {
    vocative = firstName + 'e';
  } else if (lower.endsWith('i') || lower.endsWith('y') || lower.endsWith('e') || lower.endsWith('o') || lower.endsWith('u')) {
    // Jiri -> Jiri, Tony -> Tony
    vocative = firstName;
  } else {
    // Fallback
    vocative = firstName;
  }

  // Restore capitalization logic for the modified part
  if (firstName[0] === firstName[0].toUpperCase()) {
    vocative = vocative.charAt(0).toUpperCase() + vocative.slice(1);
  }

  return rest ? `${vocative} ${rest}` : vocative;
}
