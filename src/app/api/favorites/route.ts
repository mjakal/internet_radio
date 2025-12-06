import { NextResponse } from 'next/server';
import { RadioStation } from '@/app/types';
import { getFavorites, addFavorite, deleteFavorite } from '@/lib/db';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER;

export function GET() {
  if (PLAYER_TYPE === 'STANDALONE') {
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  try {
    const favorites = getFavorites();

    return NextResponse.json({ data: favorites });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (PLAYER_TYPE === 'STANDALONE') {
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }

  try {
    const data: RadioStation = await request.json(); // Parse JSON body
    const result = addFavorite(data);

    return NextResponse.json({ data: { ...result } });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (PLAYER_TYPE === 'STANDALONE') {
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  try {
    const data: RadioStation = await request.json();

    deleteFavorite(data.station_id);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
