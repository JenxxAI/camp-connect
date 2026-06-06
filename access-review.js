const admin = require('firebase-admin');
const sa = require('./your-key-file.json');

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

async function review() {
  const result = await admin.auth().listUsers(1000);

  console.log('=== ACCESS REVIEW ===');
  console.log('Date:', new Date().toISOString());
  console.log('Total users:', result.users.length);
  console.log('');

  result.users.forEach(user => {
    const lastLogin = user.metadata.lastSignInTime;
    const daysSince = lastLogin
      ? Math.floor((Date.now() - new Date(lastLogin)) / (1000 * 60 * 60 * 24))
      : 'never';

    const flag = daysSince > 90 || daysSince === 'never' ? ' *** REVIEW ***' : '';

    console.log(
      user.email || '(anonymous)',
      '|', 'Role:', user.customClaims?.role || 'none',
      '|', 'Last login:', daysSince + ' days ago',
      '|', user.disabled ? 'DISABLED' : 'active',
      flag
    );
  });
}

review().then(() => process.exit());
