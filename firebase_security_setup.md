# Firestore Security Rules

Zkopírujte a vložte tyto pravidla do záložky **Rules** ve vaší Firebase Firestore konzoli:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Pravidla pro kolekci recenzí
    match /reviews/{reviewId} {
      
      // 1. Číst recenze může pouze přihlášený uživatel
      allow read: if request.auth != null;
      
      // 2. Vytvořit recenzi může pouze přihlášený uživatel
      // - userId v dokumentu se musí shodovat s ID přihlášeného uživatele
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.rating >= 1 
                    && request.resource.data.rating <= 5;
      
      // 3. Upravit nebo smazat může uživatel pouze VLASTNÍ recenzi
      allow update, delete: if request.auth != null 
                            && resource.data.userId == request.auth.uid;
    }
    
    // Ostatní data jsou ve výchozím nastavení zakázána
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Hardening Checklist (Splněno v kódu):
- [x] **Client SDK Only:** Používáme pouze modulární SDK v9. Žádné `firebase-admin` na frontendu.
- [x] **Žádné Private Keys:** Veškerá konfigurace využívá veřejné `NEXT_PUBLIC_` proměnné.
- [x] **Sanitizace:** Použit `DOMPurify` pro ochranu proti XSS útokům v textových recenzích.
- [x] **Auth Check:** Formulář je skrytý a submit je blokován, pokud uživatel není ověřen přes Firebase Auth.
- [x] **Session Cleanup:** Při odhlášení se čistí jak Firebase stav, tak lokální session storage.
