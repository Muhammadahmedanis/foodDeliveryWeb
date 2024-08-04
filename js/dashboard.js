import {collection, doc, db, getDocs} from './firebase.js'

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         if(user.email !== "admin@gmail.com"){
//             location.href = "login.html";
//         }
//       const uid = user.uid;
//     } else {
//         console.log("not login"); 
//     }
//   });

const q =  collection(db, "resturants");
const querySnapshot = await getDocs(q);
let i = 0;
querySnapshot.forEach((doc) => {
  i++;
  console.log(doc.id, " => ", doc.data());
});
const q1 =  collection(db, "dishes");
const querySnapshot2 = await getDocs(q1);

let j = 0;
querySnapshot2.forEach((doc) => {
  j++;
  console.log(doc.id, " => ", doc.data());
});
console.log(j);
let totalRes = document.getElementById("totalRes");
let totalDish = document.getElementById("totalDish");
if(totalRes || totalDish){
  totalRes.innerHTML = i;
  totalDish.innerHTML = j;
}