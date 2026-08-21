import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Chybí soubor nebo userId.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Vytvoříme unikátní název souboru
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${userId}-${Date.now()}${ext}`;

    // Uložíme do public/obr/seznamka/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'obr', 'seznamka', 'uploads');
    
    // Zajistíme, že složka existuje
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const fileUrl = `/obr/seznamka/uploads/${filename}`;

    return NextResponse.json({ 
      message: 'Soubor úspěšně nahrán', 
      url: fileUrl 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
