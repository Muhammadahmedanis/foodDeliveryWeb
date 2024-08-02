import {auth, signInWithEmailAndPassword, db, collection, getDocs} from './js/firebase.js'


let login = () => {
    let loginEmail = document.getElementById("loginEmail");
    let loginPassword = document.getElementById("loginPassword");
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
        const user = userCredential.user;
        if(user.email === "admin@gmail.com"){
            location.href = "dashboard.html";
        }
        console.log("login:-",  user);
    })
    .catch((error) => {
        console.log(error);
    });

}

let loginBtn = document.getElementById("loginBtn");
loginBtn && loginBtn.addEventListener("click", login);



const getAllRestaurant = async() => {
    const homeResList = document.getElementById("homeResList")
    const q = collection(db, "resturants");
    const querySnapshot = await getDocs(q);
    let ind = 0;
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        homeResList.innerHTML += `<div class="col-4">
            <div class="card" style="width: 18rem;">
                <img src= '${doc.data().img}' class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${doc.data().name}</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <p><span class="badge rounded-pill text-bg-primary">Karahi</span>
                  <span class="badge rounded-pill text-bg-primary">Burger</span>
                  <span class="badge rounded-pill text-bg-primary">Biryani</span></p>
                  <a href="dishes.html" class="btn btn-primary">View all dishes</a>
                </div>
              </div>
        </div>`
    });

}
getAllRestaurant()