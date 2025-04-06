import { NextResponse } from 'next/server';
import { RadioStation } from '@/app/types';
import { getFavorites, addFavorite, deleteFavorite } from '@/lib/db';

export function GET() {
  try {
    const favorites = getFavorites();

    return NextResponse.json({ data: favorites });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const stationData: RadioStation = await request.json(); // Parse JSON body
    const dbData = { station_id: stationData.id, ...stationData };
    const result = addFavorite(dbData);

    return NextResponse.json({ data: { id: result.station_id, ...result } });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data: RadioStation = await request.json(); // Parse JSON body

    deleteFavorite(data.id);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
