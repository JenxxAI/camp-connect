const admin = require('firebase-admin');
const sa = require('./your-key-file.json');

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

const db = admin.firestore();

async function changeRole() {
  // Find user by email
  const user = await admin.auth().getUserByEmail('newuser@testlab.com');

  const oldRole = user.customClaims?.role || 'none';
  const newRole = 'editor';

  // Update custom claim
  await admin.auth().setCustomUserClaims(user.uid, {
    role: newRole
  });

  // Update Firestore profile
  await db.collection('users').doc(user.uid).update({
    role: newRole,
    roleChangedAt: new Date().toISOString(),
    previousRole: oldRole
  });

  console.log(user.email);
  console.log(oldRole, '->', newRole);
  console.log('Note: user must sign out and back in for new role to take effect.');
}

changeRole().then(() => process.exit());
