import {auth, onAuthStateChanged} from './firebase.js'

onAuthStateChanged(auth, (user) => {
    if (user) {
        if(user.email !== "admin@gmail.com"){
            location.href = "login.html";
        }
      const uid = user.uid;
    } else {
        console.log("not login"); 
    }
  });