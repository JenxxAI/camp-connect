// ============================================================
//  CampConnect — Firebase Config & Shared Utilities
//  firebase-app.js  (loaded on every page)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── YOUR FIREBASE PROJECT CONFIG ────────────────────────────
// Replace these values with your actual Firebase project config
// from: Firebase Console → Project Settings → Your Apps → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyCCOFtjLE7JrspnLKh80G0to4vHWoA1cYc",
  authDomain: "ccsa-project-92b85.firebaseapp.com",
  projectId: "ccsa-project-92b85",
  storageBucket: "ccsa-project-92b85.firebasestorage.app",
  messagingSenderId: "1054893595299",
  appId: "1:1054893595299:web:da9227dc2066420b68bd16",
  measurementId: "G-33FYMR4851"
};
// ─────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Export so other modules can use
export { app, auth, db };
export {
  onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut,
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, onSnapshot
};

// ─── AUTH GUARD ───────────────────────────────────────────────
/**
 * requireAuth(callback)
 * Redirects to /index.html if not signed in.
 * Calls callback(user) once auth state is confirmed.
 */
export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    document.body.classList.remove("loading");
    if (!user) {
      window.location.href = "/index.html";
    } else {
      callback(user);
    }
  });
}

/**
 * getUserRole(uid) → Promise<string>
 * Returns 'admin' | 'registrar' | 'member'
 */
export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data().role || "member") : "member";
  } catch {
    return "member";
  }
}

// ─── AUDIT LOGGER ────────────────────────────────────────────
export async function logAudit(eventType, details, status = "SUCCESS") {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "audit_logs"), {
      timestamp:   serverTimestamp(),
      userId:      user?.uid  || "system",
      displayName: user?.displayName || "System",
      email:       user?.email || "",
      eventType,
      details,
      status
    });
  } catch (e) {
    console.warn("Audit log failed:", e);
  }
}

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────
export function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── HELPERS ─────────────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return `${d.toISOString().slice(0,10)} ${d.toTimeString().slice(0,8)}`;
}
