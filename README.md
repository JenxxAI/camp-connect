# CampConnect — Firebase Deployment Guide
**Cloud System Analyst Project | Grace Community Church**

---

## 📁 Project Structure

```
campconnect/
├── firebase.json              ← Firebase Hosting + Firestore config
├── firestore.rules            ← Security rules (role-based access)
├── firestore.indexes.json     ← Composite query indexes
├── .firebaserc                ← Firebase project alias (create after init)
│
└── public/                    ← Deployed to Firebase Hosting
    ├── index.html             ← Landing + Registration page
    ├── css/
    │   └── shared.css         ← All shared styles
    ├── js/
    │   └── firebase-app.js    ← Firebase SDK + shared utilities
    └── pages/
        ├── dashboard.html     ← Admin overview + audit logs
        ├── attendance.html    ← Leader attendance tracker
        └── member.html        ← Member digital pass dashboard
```

---

## 🚀 Step-by-Step Firebase Deployment

### Prerequisites
- Node.js 18+ installed
- A Google account
- Firebase CLI installed globally

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Log in to Firebase
```bash
firebase login
```

### Step 3: Create Your Firebase Project
1. Go to https://console.firebase.google.com
2. Click **Add Project** → name it `campconnect`
3. Enable **Google Analytics** (optional)
4. Click **Create Project**

### Step 4: Enable Firebase Services
In the Firebase Console, enable:
- **Authentication** → Sign-in methods: Google, Email Link
- **Firestore Database** → Start in **production mode**
- **Hosting** → Get started

### Step 5: Get Your Firebase Config
1. Console → Project Settings → Your Apps → Web App
2. Click **Add App** (web) → Register
3. Copy the `firebaseConfig` object

### Step 6: Update the Config in the Code
Open `public/js/firebase-app.js` and replace:
```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",        // ← paste your values here
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### Step 7: Initialize Firebase in Your Project Folder
```bash
cd campconnect
firebase init
```
Select:
- ✅ Firestore
- ✅ Hosting
- ✅ (skip Functions for now)

When asked:
- **Public directory**: `public`
- **Single-page app**: `No`
- **Overwrite index.html**: `No`

### Step 8: Deploy to Firebase Hosting
```bash
firebase deploy
```
Your site will be live at: `https://YOUR_PROJECT_ID.web.app`

### Step 9: Set Up the First Admin User
After deploying, sign in via Google on the site. Then in the Firebase Console:
1. **Firestore** → Add a document:
   - Collection: `users`
   - Document ID: `YOUR_UID` (get from Auth → Users)
   - Fields: `role: "admin"`, `email: "your@email.com"`

---

## 🔒 Security Architecture

### Firestore Rules (firestore.rules)
- **Admin**: Full read/write access
- **Registrar**: Read/write registrations & attendance
- **Member**: Read own registration only
- **Audit logs**: Append-only (no edits/deletes)

### Authentication
- Google OAuth (recommended)
- Email Link (passwordless)
- Role-based access enforced server-side via Firestore rules

---

## 🗃️ Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles + roles |
| `registrations` | Camp registration records |
| `attendance` | Daily attendance records per cabin |
| `audit_logs` | Immutable event log |
| `sessions` | Camp session metadata |

---

## 📄 Pages Overview

| Page | Path | Access |
|---|---|---|
| Landing + Registration | `/` | Public |
| Admin Dashboard | `/pages/dashboard.html` | Admin/Registrar |
| Attendance Tracker | `/pages/attendance.html` | Admin/Registrar |
| Member Dashboard | `/pages/member.html` | Authenticated users |

---

## 🧪 Local Development

```bash
# Install Firebase emulators
firebase init emulators
# Select: Auth, Firestore, Hosting

# Start local emulators
firebase emulators:start
```
Visit: `http://localhost:5000`

---

## 🛠️ Common Commands

```bash
firebase deploy --only hosting       # Deploy only the web pages
firebase deploy --only firestore     # Deploy only Firestore rules
firebase emulators:start             # Run locally
firebase firestore:delete --all-collections  # Clear all data (careful!)
```

---

## ✅ Post-Deployment Checklist

- [ ] Firebase config replaced in `firebase-app.js`
- [ ] Google Auth domain added in Firebase Console → Auth → Settings
- [ ] First admin user role set in Firestore
- [ ] Firestore rules deployed (`firebase deploy --only firestore`)
- [ ] Test registration flow end-to-end
- [ ] Test Google sign-in
- [ ] Verify audit logs appear in admin dashboard

---

*Built for Grace Community Church Summer Camp 2024*
*Firebase Hosting + Firestore + Authentication*
