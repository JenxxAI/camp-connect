const admin = require('firebase-admin');
const sa = require('./your-key-file.json');

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

const db = admin.firestore();

async function report() {
  const logs = await db
    .collection('audit_logs')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();

  console.log('=== SECURITY REPORT ===');
  console.log('Generated:', new Date().toISOString());
  console.log('Total events:', logs.size);

  // Count by action/event type
  const counts = {};
  logs.docs.forEach(doc => {
    const d = doc.data();
    const key = d.action || d.eventType || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });

  console.log('\nEvents by type:');
  Object.entries(counts).forEach(([k, v]) => console.log(' ', k, ':', v));

  // List unique users
  const users = new Set();
  logs.docs.forEach(doc => {
    const email = doc.data().email;
    if (email) users.add(email);
  });

  console.log('\nUnique users:', users.size);
  users.forEach(u => console.log(' ', u));
}

report().then(() => process.exit());
