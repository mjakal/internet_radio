import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'radio.db'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    favicon TEXT,
    tags VARCHAR(1000),
    codec VARCHAR(10),
    bitrate INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function getFavorites() {
  return db
    .prepare(
      'SELECT station_id, name, url, favicon, tags, codec, bitrate FROM favorites ORDER BY created_at',
    )
    .all();
}

export function addFavorite(favorite: {
  station_id: string;
  name: string;
  url: string;
  favicon?: string;
  tags?: string;
  codec?: string;
  bitrate?: number;
}) {
  const stmt = db.prepare(
    'INSERT INTO favorites (station_id, name, url, favicon, tags, codec, bitrate) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  return stmt.run(
    favorite.station_id,
    favorite.name,
    favorite.url,
    favorite.favicon,
    favorite.tags,
    favorite.codec,
    favorite.bitrate,
  );
}

export function deleteFavorite(station_id: string) {
  const stmt = db.prepare('DELETE FROM favorites WHERE station_id = ?');
  const result = stmt.run(station_id);

  return {
    changes: result.changes,
    success: result.changes > 0,
    message:
      result.changes > 0
        ? `Deleted favorite with station_id: ${station_id}`
        : `No favorite found with station_id: ${station_id}`,
  };
}

export default db;
