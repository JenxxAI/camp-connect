const admin = require('firebase-admin');
const sa = require('./your-key-file.json');

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

const db = admin.firestore();

async function onboard() {
  // Create the user
  const user = await admin.auth().createUser({
    email: 'newuser@testlab.com',
    password: 'Welcome123!',
    displayName: 'New User'
  });
  console.log('Created:', user.uid);

  // Set default role as custom claim
  await admin.auth().setCustomUserClaims(user.uid, {
    role: 'viewer'
  });

  // Create Firestore profile
  await db.collection('users').doc(user.uid).set({
    email: user.email,
    displayName: 'New User',
    role: 'viewer',
    status: 'active',
    onboardedAt: new Date().toISOString()
  });

  console.log('Onboarded with role: viewer');
}

onboard().then(() => process.exit());
