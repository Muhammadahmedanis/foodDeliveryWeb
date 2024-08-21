import {collection, doc, db, getDocs} from './firebase.js'

let fetchCollectionData = async(collectionName) => {
    const q = collection(db, collectionName);
    const querySnapshot = await getDocs(q);
    let count = 0;
    querySnapshot.forEach((doc) => {
      count++;
      console.log(doc.id, " => ", doc.data());
    });
    return count;
  }
  
let displayCounts = async () => {
const totalRestaurants = await fetchCollectionData("resturants");
const totalDishes = await fetchCollectionData("dishes");
const totalOrders  = await fetchCollectionData("orders");

let totalRes = document.getElementById("totalRes");
let totalDish = document.getElementById("totalDish");
let totalOrder = document.getElementById("totalOrder");

    if (totalRes) {
        totalRes.innerHTML = totalRestaurants;
    }
    if (totalDish) {
        totalDish.innerHTML = totalDishes;
    }
    if(totalOrder){
        totalOrder.innerHTML = totalOrders;
    }
}
  
// Call the function to execute
displayCounts();