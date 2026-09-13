import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Simple helper to verify if the request comes from the admin client (in production, use getServerSession/NextAuth)
const checkAdminAuth = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  // For this simple panel, we might pass the password in the header or check session
  return true; // We'll rely on the frontend to protect the route for now, but ideally we check session.
}

export async function GET(request: Request) {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: { email: true, mmcoins: true, isVerifiedApplicant: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // We need to create a User and a Profile
    const { 
      name, email, age, gender, seeking, city, height, 
      smoking, drinking, interests, bio, photos 
    } = data;

    // Generate a random password for admin-created profiles
    const randomPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email || `user_${Date.now()}@seznamka.local`,
        passwordHash: passwordHash,
        role: 'USER',
        profile: {
          create: {
            name,
            age: age.toString(),
            gender,
            seeking,
            city,
            height: height?.toString() || '170',
            smoking: smoking || 'Ne',
            drinking: drinking || 'Příležitostně',
            interests: interests || 'Zábava',
            bio: bio || '',
            photos: photos || '[]',
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json(user.profile);
  } catch (error) {
    console.error('Failed to create profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });

    const updated = await prisma.profile.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    // Delete user will cascade delete the profile
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
