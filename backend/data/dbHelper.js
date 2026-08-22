import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDbPath() {
  const localPath = path.join(__dirname, 'db.json');
  if (fs.existsSync(localPath)) return localPath;
  const rootPath = path.join(process.cwd(), 'backend', 'data', 'db.json');
  if (fs.existsSync(rootPath)) return rootPath;
  return localPath;
}

let memoryDb = null;

export const readDb = () => {
  if (memoryDb) return memoryDb;
  try {
    const targetPath = getDbPath();
    if (fs.existsSync(targetPath)) {
      const data = fs.readFileSync(targetPath, 'utf8');
      memoryDb = JSON.parse(data);
      return memoryDb;
    }
  } catch (error) {
    console.error('Error reading database file:', error);
  }
  return { users: [], projects: [], orders: [], inquiries: [] };
};

export const writeDb = (data) => {
  memoryDb = data;
  try {
    const targetPath = getDbPath();
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.warn('Filesystem write notice (Vercel serverless in-memory fallback):', error.message);
    return true;
  }
};

