import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nebyl vybrán žádný soubor.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '';
    const filename = `arzenal-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'arzenal');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const fileUrl = `/uploads/arzenal/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru při nahrávání.' }, { status: 500 });
  }
}
