import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { RadioStation } from "@/app/types";

const CACHED_FAVORITES: {
  favorites: RadioStation[];
} = {
  favorites: [],
};

const loadFavorites = async (filePath: string = 'favorites.json') => {
  console.log('loading data from file');
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const parsedData = JSON.parse(data);

    CACHED_FAVORITES['favorites'] = parsedData ? parsedData : [];
  } catch (err) {
    console.error('Error reading JSON file:', err);
  };
};

// Load favorites.json before first api request
await loadFavorites('favorites.json');

const saveFavorites = async () => {
  const { favorites } = CACHED_FAVORITES;

  console.log('saving data to file');

  await fs.writeFile('favorites.json', JSON.stringify(favorites, null, 2));
}

// Save favorites to json every hour
// Need to store this in sqlite3 
setTimeout(saveFavorites, 3600000);

export function GET() {
  try {
    const { favorites } = CACHED_FAVORITES;

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
    const data: RadioStation = await request.json(); // Parse JSON body
    const { id } = data;
    const { favorites } = CACHED_FAVORITES;

    const alreadySet = favorites.findIndex((item) => item.id === id);

    console.log('alreadySet', alreadySet);

    // Early exit - trying to add duplicate favorites
    if (alreadySet !== -1) return NextResponse.json({ data });

    favorites.push({ ...data });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'API request failed.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const data: RadioStation = await request.json(); // Parse JSON body
    const { id } = data;
    
    const { favorites } = CACHED_FAVORITES;
    const nextFavorites = favorites.filter((item) => item.id !== id);

    CACHED_FAVORITES['favorites'] = [...nextFavorites];

    return NextResponse.json({ data: nextFavorites });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { data: [] },
      { status: 500 },
    );
  }
}