/* global process, global */
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMongoUri() {
  let loadedUri = '';
  let logMsg = '';
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const exists = fs.existsSync(envPath);
    logMsg += `[${new Date().toISOString()}] envPath: ${envPath}, exists: ${exists}\n`;
    if (exists) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      envFile.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
          if (key === 'MONGODB_URI') {
            loadedUri = value;
          }
        }
      });
      logMsg += `  Parsed MONGODB_URI: ${loadedUri ? loadedUri.replace(/:([^:@]+)@/, ':****@') : 'not found'}\n`;
    }
  } catch (e) {
    logMsg += `  Failed to parse env in db.js: ${e.message}\n`;
  }
  
  if (loadedUri) {
    process.env.MONGODB_URI = loadedUri;
  }
  const finalUri = loadedUri || process.env.MONGODB_URI;
  logMsg += `  Final URI used: ${finalUri ? finalUri.replace(/:([^:@]+)@/, ':****@') : 'empty'}\n`;
  
  try {
    fs.appendFileSync(path.resolve(process.cwd(), 'api_log.txt'), logMsg);
  } catch (e) {
    console.error('Failed to write log:', e);
  }
  
  return finalUri || "mongodb+srv://DurgaPraveen:<db_password>@cluster0.tu1wd6o.mongodb.net/portfolio?retryWrites=true&w=majority";
}

let client = null;
let clientPromise = null;

export async function connectToDatabase() {
  const finalUri = getMongoUri();
  
  if (!client) {
    client = new MongoClient(finalUri);
    clientPromise = client.connect().catch(err => {
      // Clear client/promise on connection failure so subsequent requests retry
      client = null;
      clientPromise = null;
      throw err;
    });
  }

  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db('portfolio');
    return { db, client: connectedClient };
  } catch (err) {
    // If the promise was rejected, clear the cached variables to allow a retry on the next call
    client = null;
    clientPromise = null;
    throw err;
  }
}
