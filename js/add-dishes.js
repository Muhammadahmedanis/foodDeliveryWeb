import { storage, ref, uploadBytesResumable, getDownloadURL, doc, db, addDoc, getDoc, getDocs, collection } from './firebase.js';
import {uploadFile} from './restaurant.js'

const getAllRestaurant = async() => {
    const resturantName = document.getElementById("resturantName");
    if(resturantName){
            resturantName.innerHTML = '<option selected>Select resturant</option>';
            const q = collection(db, "resturants");
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            resturantName.innerHTML += `<option value ='${doc.id}'> ${doc.data().name}</option>`
        });
    }
    getAllDishes();

}
getAllRestaurant();


const getAllDishes = async() => {
    let ind = 0;
    const allDishes = document.getElementById("allDishes");
    const q = collection(db, "dishes");
    const querySnapshot = await getDocs(q);
    allDishes.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        ind++;
    allDishes.innerHTML += ` 
        <tr class="text-center">
            <th scope="row">${ind}</th>
            <td><img class="dishImage" src='${doc.data().image}' alt=""></td>
            <td>${doc.data().name}</td>
            <td>${doc.data().price}</td>
            <td>${doc.data().serving}</td>
            <td>${doc.data().restaurant}</td>
        </tr>`;
    });

}


let Dish = async() => {
    let btnClose = document.getElementById("btn-close") 
    let loaderDish = document.getElementById("loaderDish");
    let dishImage = document.getElementById("dishImage");
    let resturantName = document.getElementById("resturantName");
    let dishName = document.getElementById("dishName");
    let dishPrice = document.getElementById("dishPrice");
    let dishServing = document.getElementById("dishServing");
    loaderDish.style.display = "block";
    let image = await uploadFile(dishImage.files[0], dishName.value);
    const resRef = doc(db, "resturants", resturantName.value);
    const docSnap = await getDoc(resRef);

    const dishDetail = {
        resId: resturantName.value,
        restaurant: docSnap.data().name ? docSnap.data().name: "name is not register",
        image,
        name: dishName.value,
        price: dishPrice.value,
        serving: dishServing.value,
    }
    console.log(dishDetail);
    const docRef = await addDoc(collection(db, "dishes"), dishDetail)
    // console.log(docRef);
    loaderDish.style.display = "none";
    btnClose.click();
    getAllDishes();
    dishImage.value = '';
    resturantName.value = '';
    dishName.value = '';
    dishPrice.value = '';
    dishServing.value = '';
}
const addDish = document.getElementById("addDish");
addDish.addEventListener("click", Dish);

