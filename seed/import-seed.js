import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, doc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if available
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-app.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "mock-app",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-app.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:0000:web:0000"
};

console.log("--------------------------------------------------");
console.log("EasyDes Smart Village - Firestore Seeding Utility");
console.log(`Targeting Firebase Project: ${firebaseConfig.projectId}`);
console.log("--------------------------------------------------");

// Initialize Firebase App and Firestore
let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("❌ Failed to initialize Firebase SDK:", error.message);
  process.exit(1);
}

// Collections mapping list
const collectionsToSeed = [
  { file: 'citizens.json', collection: 'citizens', key: 'nik' },
  { file: 'employees.json', collection: 'employees', key: 'id' },
  { file: 'attendance.json', collection: 'attendance', key: 'id' },
  { file: 'letters.json', collection: 'letters', key: 'id' },
  { file: 'taxpayers.json', collection: 'taxpayers', key: 'nop' },
  { file: 'projects.json', collection: 'projects', key: 'id' },
  { file: 'complaints.json', collection: 'complaints', key: 'id' },
  { file: 'assets.json', collection: 'assets', key: 'id' },
  { file: 'budget.json', collection: 'budget', key: 'id' }
];

async function runSeeding() {
  for (const item of collectionsToSeed) {
    const filePath = path.join(__dirname, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Seed file ${item.file} not found. Skipping...`);
      continue;
    }

    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const documents = JSON.parse(rawData);
      
      console.log(`📦 Seeding collection "${item.collection}" with ${documents.length} records...`);
      
      // Firestore batch supports up to 500 operations
      const batch = writeBatch(db);
      
      for (const docData of documents) {
        const docRef = doc(db, item.collection, String(docData[item.key]));
        batch.set(docRef, {
          ...docData,
          _syncedAt: new Date().toISOString(),
          _source: 'Prodeskel Master Data'
        }, { merge: true });
      }

      await batch.commit();
      console.log(`✅ Collection "${item.collection}" successfully seeded.`);
    } catch (err) {
      console.error(`❌ Error seeding collection "${item.collection}":`, err.message);
    }
  }

  console.log("--------------------------------------------------");
  console.log("🎉 Seeding operations completed.");
  console.log("--------------------------------------------------");
}

runSeeding().catch(console.error);
