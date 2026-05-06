import { auth, database } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// SIGN UP
function signUp() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    alert("Fill all fields");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user.uid);
      return set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email
      });
    })
    .then(() => {
      console.log("Data saved in Database"); 
      alert("Signup successful!");
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.error("ERROR:", error);
      alert(error.message);
    });
}


// LOGIN
function logIn() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //Correct login
      console.log("Login success");
      window.location.href = "home.html";
    })
    .catch((error) => {
      //Handle wrong credentials
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Wrong Email / Password");
      } else {
        alert(error.message);
      }
    });
}

// Make functions global for HTML
window.signUp = signUp;
window.logIn = logIn;