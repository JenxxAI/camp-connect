const admin = require('firebase-admin');
const sa = require('./your-key-file.json');

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

const db = admin.firestore();

async function offboard() {
  const user = await admin.auth().getUserByEmail('newuser@testlab.com');

  // Revoke all sessions
  await admin.auth().revokeRefreshTokens(user.uid);

  // Disable the account
  await admin.auth().updateUser(user.uid, {
    disabled: true
  });

  // Update profile (don't delete — preserve the audit trail)
  await db.collection('users').doc(user.uid).update({
    status: 'offboarded',
    offboardedAt: new Date().toISOString()
  });

  console.log('Offboarded:', user.email);
  console.log('Account disabled, sessions revoked');
}

offboard().then(() => process.exit());
