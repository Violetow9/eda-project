import { NextResponse } from 'next/server';
import { getMe } from '@/app/lib/auth';

export async function GET() {
  const me = await getMe();
  if (!me) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json(me);
}
