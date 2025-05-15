import {
  auth,
  db,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  doc,
  setDoc,
  serverTimestamp
} from "./firebase-config.js";

import { checkLogin } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const googleLogin = document.getElementById("googleLogin");

  // 🔄 Toggle Forms
  showSignup?.addEventListener("click", e => {
    e.preventDefault();
    loginForm?.classList.add("hidden");
    signupForm?.classList.remove("hidden");
  });

  showLogin?.addEventListener("click", e => {
    e.preventDefault();
    signupForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
  });

  // 🔐 Handle Login
  loginForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return alert("Please enter email and password");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      alert(`Welcome back, ${user.email}`);
      localStorage.setItem("login", JSON.stringify(true));
      window.location.href = "index.html";
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });

  // 📝 Handle Signup
 signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const rawNumber = document.getElementById("userContactNumber").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  const userphone = rawNumber.replace(/\D/g, ""); // Remove non-digit chars

  if (!name || !email || !password || !userphone) {
    alert("Please fill in all fields correctly.");
    return;
  }

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      image: user.photoURL || "",
      userphone,
      createdAt: serverTimestamp(),
    });

    alert("✅ Signup successful! Data stored in Firestore.");
    // Optional: Switch UI to login form or redirect to login
  } catch (err) {
    console.error("❌ Firebase error:", err);

    if (err.code === "auth/email-already-in-use") {
      alert("⚠️ Email already in use. Please login instead.");
    } else {
      alert("Signup failed: " + err.message);
    }
  }
});


  // 🔗 Google Login
  googleLogin?.addEventListener("click", async e => {
    e.preventDefault();
    try {
      const { user } = await signInWithPopup(auth, googleProvider);

      const generatedNumber = new Date().getTime(); // fallback phone-like unique value

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL || "",
        createdAt: serverTimestamp(),
        userphone: generatedNumber.toString
      });

      alert("Google login successful!");
      localStorage.setItem("login", JSON.stringify(true));
      window.location.href = "index.html";
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  });
});
