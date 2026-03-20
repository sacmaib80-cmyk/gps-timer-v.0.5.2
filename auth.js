import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function setupAuthUI(){
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userBox = document.getElementById("userBox");
  const userPhoto = document.getElementById("userPhoto");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  if(!googleLoginBtn || !logoutBtn || !userBox || !userPhoto || !userName || !userEmail){
    console.warn("Auth UI not ready");
    return;
  }

  googleLoginBtn.addEventListener("click", async () => {
    try{
      await signInWithPopup(auth, provider);
    }catch(err){
      console.error("Google login failed:", err);
      alert("Login failed");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try{
      await signOut(auth);
    }catch(err){
      console.error("Logout failed:", err);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if(user){
      userBox.hidden = false;
      googleLoginBtn.hidden = true;
      logoutBtn.hidden = false;

      userName.textContent = user.displayName || "No name";
      userEmail.textContent = user.email || "";
      if(user.photoURL){
        userPhoto.src = user.photoURL;
      }else{
        userPhoto.removeAttribute("src");
      }
    }else{
      userBox.hidden = true;
      googleLoginBtn.hidden = false;
      logoutBtn.hidden = true;

      userName.textContent = "";
      userEmail.textContent = "";
      userPhoto.removeAttribute("src");
    }
  });
}

window.addEventListener("DOMContentLoaded", setupAuthUI);