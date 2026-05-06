import { auth, database } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {

    const navRight = document.getElementById("navRight");

    auth.onAuthStateChanged(async (user) => {
        if (user) {

            try {
                //Fetch username from DB
                const snapshot = await get(ref(database, 'users/' + user.uid));

                let username = "User";

                if (snapshot.exists()) {
                    username = snapshot.val().username;
                }

                navRight.innerHTML = `
                    <span>Hi, ${username}</span>
                    <button class="logout-btn" id="logoutBtn">Logout</button>
                `;

                document.getElementById("logoutBtn").addEventListener("click", () => {
                    const confirmLogout = confirm("You are Logging Out....");
                    if (confirmLogout) {
                        signOut(auth).then(() => {
                            window.location.href = "index.html";
                        });
                    }
                });

            } catch (error) {
                console.error("Error fetching username:", error);
            }

        } else {
            navRight.innerHTML = `
                <a href="auth.html">Login / Signup</a>
            `;
        }
    });

});