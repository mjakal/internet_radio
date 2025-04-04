import { NextResponse } from 'next/server';
import fs from 'fs';
import { RadioStation } from "@/app/types";

const CACHED_FAVORITES: {
  favorites: RadioStation[] | [];
} = {
  favorites: [
    {
      id: '111',
      name: 'asd',
      url: 'pero',
      favicon: 'pero',
      tags: 'pero',
      codec: 'mp3',
      votes: 'asd',
      clickcount: 111,
    }
  ],
};

const saveFavorites = () => {
  const { favorites } = CACHED_FAVORITES;

  fs.writeFile('favorites.json', JSON.stringify(favorites, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('JSON data saved to data.json');
    }
  });
}

export function GET() {
  try {
    const { favorites } = CACHED_FAVORITES;

    saveFavorites();

    return NextResponse.json({ data: favorites });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { data: [] },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'API request failed.' },
      { status: 500 }
    );
  }
}

export function DELETE() {
  try {
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { data: [] },
      { status: 500 },
    );
  }
}
