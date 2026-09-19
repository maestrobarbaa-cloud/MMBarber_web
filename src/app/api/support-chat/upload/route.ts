import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const sessionId = formData.get('sessionId') as string;

    if (!file || !sessionId) {
      return NextResponse.json({ error: 'Chybí soubor nebo sessionId.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '';
    const filename = `${sessionId}-${Date.now()}${ext}`;
    
    // Determine type based on mime
    const isVideo = file.type.startsWith('video/');
    const attachmentType = isVideo ? 'video' : 'image';

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const fileUrl = `/uploads/chat/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      type: attachmentType
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
