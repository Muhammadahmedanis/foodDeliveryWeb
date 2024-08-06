import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, collection, getDocs, onAuthStateChanged, signOut} from './js/firebase.js'

let login = () => {
    let loginEmail = document.getElementById("loginEmail");
    let loginPassword = document.getElementById("loginPassword");
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
        const user = userCredential.user;
        if(user.email === "admin@gmail.com"){
            location.href = "dashboard.html";
            console.log("login:-",  user);
        }
        else{
            location.href = "index.html";
        }
    })
    .catch((error) => {
        console.log(error);
    });

}

let logout = () => {
    signOut(auth).then(() => {
        console.log("Sign-out successful");
        location.href = "login.html";
      }).catch((error) => {
        console.log("error in logout");
      });
}
    

let loginBtn = document.getElementById("loginBtn");
loginBtn && loginBtn.addEventListener("click", login);

let logoutBtn = document.getElementById("logoutBtn");
logoutBtn && logoutBtn.addEventListener("click", logout)


const getAllRestaurant = async() => {
    const spinner = document.querySelector(".spinner");
    const homeResList = document.getElementById("homeResList")
    const q = collection(db, "resturants");
    const querySnapshot = await getDocs(q);
    let ind = 0;
    if(homeResList){
    homeResList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        homeResList.innerHTML += `
            <div class="col-12 col-lg-3 col-md-4 gap-3 justify-content-center align-items-center ms-5 py-2">
            <div class="card" style="width: 18rem;">
            <img src= '${doc.data().img}' class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title">${doc.data().name}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <p><span class="badge rounded-pill text-bg-primary">Karahi</span>
            <span class="badge rounded-pill text-bg-primary">Burger</span>
            <span class="badge rounded-pill text-bg-primary">Biryani</span></p>
            <a href="dishes.html?resturants=${doc.id}" class="btn btn-primary">View all dishes</a>
            </div>
            </div>
            </div>`
        });
        }
        if(spinner){
            spinner.style.display = "none";
        }
}
// getAllRestaurant()

let registerEmail = document.getElementById("registerEmail");
let registerPassword = document.getElementById("registerPassword");
let Register = () => {
    createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("login:-", user);
    location.href = "login.html";
  })
  .catch((error) => {
    console.log("error in login", error);
  });

}

let register = document.getElementById("register");
register && register.addEventListener("click", Register)

let dashboard = document.querySelector(".dashboard");
let registerBtn = document.getElementById("registerBtn");
let name = document.getElementById("name");
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        getAllRestaurant();
        if(user.email === "admin@gmail.com" && dashboard){
            dashboard.classList.add("d-flex")
        }
        registerBtn.style.display = "none";
        if(name){
            name.style.display = "block";
            name.innerHTML = user.email.slice(0,1).toUpperCase();
        }
    } else {
        console.log("not login");
        if(registerBtn){
            registerBtn.style.display = "block";
        }
    }
  });
