import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = require(join(__dirname, '../My Gear Garage Firebase Admin SDK.json'));

// Try with firebasestorage.app bucket
async function setCorsFbStorage() {
  const app1 = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'my-gear-garage.firebasestorage.app'
  }, 'app1');

  const bucket1 = getStorage(app1).bucket();

  const corsConfiguration = [
    {
      origin: ['https://my-gear-garage.web.app', 'http://localhost:5173'],
      method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'x-goog-*'],
      maxAgeSeconds: 3600
    }
  ];

  try {
    await bucket1.setCorsConfiguration(corsConfiguration);
    console.log('CORS configuration set successfully for firebasestorage.app bucket');
  } catch (error) {
    console.error('Error setting CORS for firebasestorage.app bucket:', error);
  }
}

// Try with appspot.com bucket
async function setCorsAppspot() {
  const app2 = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'my-gear-garage.appspot.com'
  }, 'app2');

  const bucket2 = getStorage(app2).bucket();

  const corsConfiguration = [
    {
      origin: ['https://my-gear-garage.web.app', 'http://localhost:5173'],
      method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'x-goog-*'],
      maxAgeSeconds: 3600
    }
  ];

  try {
    await bucket2.setCorsConfiguration(corsConfiguration);
    console.log('CORS configuration set successfully for appspot.com bucket');
  } catch (error) {
    console.error('Error setting CORS for appspot.com bucket:', error);
  }
}

async function setCorsForBoth() {
  await setCorsFbStorage();
  await setCorsAppspot();
  process.exit();
}

setCorsForBoth(); 