// home.js
import { auth, database } from "./firebase.js";
import { ref, push, onValue, remove } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Encode / Decode
function encrypt(text) {
    return btoa(text);
}

function decrypt(text) {
    return atob(text);
}

// Copy Text
function copyText(text) {
    navigator.clipboard.writeText(text);

    const alertBox = document.getElementById("alert");
    if (alertBox) {
        alertBox.style.display = "inline";
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 1500);
    }
}

//Password Strength
function getStrength(password) {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Medium";
}

//Toggle Password
function togglePassword(id, encryptedPass) {
    const el = document.getElementById(id);

    if (!el) return;

    if (el.dataset.visible === "true") {
        el.innerText = "*****";
        el.dataset.visible = "false";
    } else {
        el.innerText = decrypt(encryptedPass);
        el.dataset.visible = "true";
    }
}

//Delete Password
function deletePassword(id) {
    const user = auth.currentUser;
    if (!user) return;

    remove(ref(database, 'users/' + user.uid + '/passwords/' + id));
}

//Global Data
let allData = {};

//Show Passwords
function showPasswords() {
    const user = auth.currentUser;
    if (!user) return;

    const dbRef = ref(database, 'users/' + user.uid + '/passwords');

    onValue(dbRef, (snapshot) => {
        allData = snapshot.val() || {};
        renderPasswords(allData);
    });
}

//Render UI
function renderPasswords(data) {
    const container = document.getElementById("passwordList");
    if (!container) return;

    container.innerHTML = "";

    if (!data || Object.keys(data).length === 0) {
        container.innerHTML = "<p>No passwords saved</p>";
        return;
    }

    Object.keys(data).forEach((key, index) => {
        const item = data[key];
        const decrypted = decrypt(item.password);
        const strength = getStrength(decrypted);

        container.innerHTML += `
        <div class="password-item">
            <div class="password-info">
                <strong>${item.website}</strong>
                <span>${item.username}</span>
                <span id="pass-${index}" data-visible="false">*****</span>
                <small>Strength: ${strength}</small>
            </div>

            <div class="password-actions">
                <button class = "see-btn" onclick="togglePassword('pass-${index}', '${item.password}')">👁️</button>
                <button class="copy-btn" onclick="copyText('${decrypted}')">📋</button>
                <button class="delete-btn" onclick="deletePassword('${key}')">🗑</button>
            </div>
        </div>
        `;
    });
}

//Add Password
function addPassword(e) {
    e.preventDefault();

    const website = document.getElementById("website").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = auth.currentUser;

    if (!user) {
        alert("User not logged in");
        return;
    }

    if (!website || !username || !password) {
        alert("Fill all fields");
        return;
    }

    push(ref(database, 'users/' + user.uid + '/passwords'), {
        website,
        username,
        password: encrypt(password)
    });

    document.getElementById("passwordForm").reset();
}

auth.onAuthStateChanged((user) => {
    if (user) {
        showPasswords();

        const form = document.getElementById("passwordForm");
        if (form) {
            form.addEventListener("submit", addPassword);
        }

    
        const searchInput = document.getElementById("search");
        if (searchInput) {
            searchInput.addEventListener("input", function () {
                const value = this.value.toLowerCase();

                const filtered = Object.fromEntries(
                    Object.entries(allData).filter(([key, item]) =>
                        item.website.toLowerCase().includes(value) ||
                        item.username.toLowerCase().includes(value)
                    )
                );

                renderPasswords(filtered);
            });
        }

    } else {
        window.location.href = "index.html";
    }
});

auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

window.copyText = copyText;
window.deletePassword = deletePassword;
window.togglePassword = togglePassword;