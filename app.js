import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, collection, getDocs, onAuthStateChanged, signOut } from './js/firebase.js';

const getAllRestaurant = async () => {
    const spinner = document.querySelector(".spinner");
    const homeResList = document.getElementById("homeResList");
    const q = collection(db, "resturants");
    try {
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.size);
        if (homeResList) {
            homeResList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                homeResList.innerHTML += `
                    <div class="my-3">
                        <div class="card" style="width: 18rem;">
                            <img src='${doc.data().img}' class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${doc.data().name}</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <p>
                                    <span class="badge rounded-pill text-bg-primary">Karahi</span>
                                    <span class="badge rounded-pill text-bg-primary">Burger</span>
                                    <span class="badge rounded-pill text-bg-primary">Biryani</span>
                                </p>
                                <a href="dishes.html?resturants=${doc.id}" class="btn btn-primary">View all dishes</a>
                            </div>
                        </div>
                    </div>`;
            });
        }
        if (spinner) {
            spinner.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        if (spinner) {
            spinner.style.display = "none";
        }
    }
};

getAllRestaurant();

const login = () => {
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    if (!loginEmail || !loginPassword) {
        console.error("Login form fields are missing.");
        return;
    }

    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.email === "admin@gmail.com") {
                location.href = "dashboard.html";
            } else {
                location.href = "index.html";
            }
            console.log("Logged in:", user);
        })
        .catch((error) => {
            console.error("Error in login:", error);
        });
};

const logout = () => {
    signOut(auth)
        .then(() => {
            console.log("Sign-out successful");
            location.href = "login.html";
            const name = document.getElementById("name");
            if (name) {
                name.style.display = "none";
            }
        })
        .catch((error) => {
            console.error("Error in logout:", error);
        });
};

const register = () => {
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");

    if (!registerEmail || !registerPassword) {
        console.error("Register form fields are missing.");
        return;
    }

    createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Registered and logged in:", user);
            location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error in registration:", error);
        });
};

// Add event listeners
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", login);
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

const registerBtn = document.getElementById("register");
if (registerBtn) {
    registerBtn.addEventListener("click", register);
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
    const dashboard = document.querySelector(".dashboard");
    const name = document.getElementById("name");
    const registerBtn = document.getElementById("registerBtn");

    if (user) {
        // getAllRestaurant()
        if (user.email === "admin@gmail.com" && dashboard) {
            dashboard.classList.add("d-flex");
        }
        if (registerBtn) {
            registerBtn.style.display = "none";
        }
        if (loginBtn) {
            loginBtn.style.display = "block";
        }
        if (name) {
            name.style.display = "block";
            name.textContent = user.email.charAt(0).toUpperCase();
        }
        console.log("User is logged in:", user);
    } else {
        console.log("User is not logged in.");
        if (registerBtn) {
            registerBtn.style.display = "block";
        }
        if (name) {
            name.style.display = "none";
        }
    }
});
