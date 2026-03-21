console.log("AUTH LOADED");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_GnE6EKZdxem2XUHpgMuub2gPj3_PFgM",
  authDomain: "sakuraq-b7f96.firebaseapp.com",
  projectId: "sakuraq-b7f96",
  storageBucket: "sakuraq-b7f96.firebasestorage.app",
  messagingSenderId: "1069498952404",
  appId: "1:1069498952404:web:34daf6db0244513bda6941",
  measurementId: "G-L7BZVP9WRR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function getEls() {
  return {
    googleLoginBtn: document.getElementById("googleLoginBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    userBox: document.getElementById("userBox"),
    userPhoto: document.getElementById("userPhoto"),
    userName: document.getElementById("userName"),
    userEmail: document.getElementById("userEmail"),
    authGateLoginBtn: document.getElementById("authGateLoginBtn")
  };
}

function renderSignedOut() {
  const el = getEls();

  if (el.googleLoginBtn) el.googleLoginBtn.hidden = false;
  if (el.logoutBtn) el.logoutBtn.hidden = true;
  if (el.userBox) el.userBox.hidden = true;

  if (el.userPhoto) el.userPhoto.src = "";
  if (el.userName) el.userName.textContent = "Guest";
  if (el.userEmail) el.userEmail.textContent = "";
}

function renderSignedIn(user) {
  const el = getEls();

  if (el.googleLoginBtn) el.googleLoginBtn.hidden = true;
  if (el.logoutBtn) el.logoutBtn.hidden = false;
  if (el.userBox) el.userBox.hidden = false;

  if (el.userPhoto) el.userPhoto.src = user.photoURL || "";
  if (el.userName) el.userName.textContent = user.displayName || "No name";
  if (el.userEmail) el.userEmail.textContent = user.email || "";
}

async function loginWithGoogle() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    if (error.code === "auth/popup-blocked") {
      alert("Popup ถูกบล็อก");
      return;
    }

    if (error.code === "auth/unauthorized-domain") {
      alert("ยังไม่ได้เพิ่ม domain ใน Firebase");
      return;
    }

    alert(error.code);
  }
}

async function logoutNow() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

onAuthStateChanged(auth, (user) => {
  console.log("Auth state:", user);

  if (user) {
    renderSignedIn(user);
  } else {
    renderSignedOut();
  }

  // 👉 ปลดล็อกหน้าจอ
  const gate = document.getElementById("authGate");
  if (gate) {
    gate.style.display = user ? "none" : "flex";
  }
});


// ✅ FIX สำคัญสุด: ใช้ delegation (ไม่พังอีก)
document.addEventListener("click", (e) => {
  if (e.target.closest("#authGateLoginBtn, #googleLoginBtn")) {
    loginWithGoogle();
  }

  if (e.target.closest("#logoutBtn")) {
    logoutNow();
  }
});