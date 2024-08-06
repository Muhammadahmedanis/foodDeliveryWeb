import { collection, getDocs, getDoc, db, doc, where, query} from './firebase.js';
var urlParams = new URLSearchParams(window.location.search);
let spinner = document.querySelector(".spinner");
const mainContent = document.getElementById("mainContent");

const getResturantDetail = async () => {
    let resName = document.getElementById("resName");
    let resAddress = document.getElementById("resAddress");
    let resImg = document.getElementById("resImg");
    const docRef = doc(db, "resturants", urlParams.get('resturants'));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        resName.innerHTML = docSnap.data().name;
        resAddress.innerHTML = docSnap.data().address;
        resImg.src = docSnap.data().img;

    } else {
        console.log("No such document!");
    }
getAllDishes();

}
getResturantDetail()

let allDishes = [];
const getAllDishes = async () => {
  try {
    const cartDishes = document.getElementById("cartDishes");
    const q = query(collection(db, "dishes"), where('resId', "==", urlParams.get('resturants')));
    const querySnapshot = await getDocs(q);
    // if(querySnapshot.exists()){

        cartDishes.innerHTML = '';
        querySnapshot.forEach((doc) => {
            allDishes.push({...doc.data(), id: doc.id});
        // console.log(doc.id, " => ", doc.data());
        cartDishes.innerHTML += `
        <div class="card-body d-flex flex-wrap align-items-center justify-content-between">
        <div class="d-flex">
            <img class="rounded" width="150" src=${doc.data().image} alt="">
            <div class="ps-4">
            <h3 class="card-title">${doc.data().name}</h3>
            <h5 class="card-title">${doc.data().price}</h5>
            <p class="card-text">${doc.data().serving}</p>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2 py-2">
        <button onclick = "updQty('-', '${doc.id}')" class="qtyBtn"><i class="fa-solid fa-minus"></i></button>
        <span class="fw-bold" id= ${doc.id}>1</span>
        <button onclick ="updQty('+', '${doc.id}')" class="qtyBtn"><i class="fa-solid fa-plus"></i></button>
        <a class="btn btn-primary py-2" onclick="addToCart('${doc.id}')" ><i class="fa-solid fa-cart-shopping"></i></a>
        </div>
        </div>`;
        });
    // }else {
    //     alert("no dish add")
    // }
    } catch (error) {
        console.error("Error fetching documents: ", error);
   }
   spinner.style.display = "none";
   mainContent.style.display = "block";
}
// getAllDishes()

const updQty = (type, id) => {
    const qty = document.getElementById(id);
    if(type === "+"){
        qty.innerHTML = Number(qty.innerHTML) + 1;
    }
    else if(type === "-" && qty.innerHTML > 1){
        qty.innerHTML = Number(qty.innerHTML) - 1;
    }
}

const addToCart = (id) => {
    let cartItem = JSON.parse(localStorage.getItem("cart")) || [];
    const qty = document.getElementById(id);
    // console.log(allDishes);
    const filter = allDishes.filter( v => v.id === id)
        cartItem.push({...filter[0], qty: Number(qty.innerHTML)});
        localStorage.setItem("cart", JSON.stringify(cartItem));
        console.log(cartItem);
        const totalAmount = document.getElementById("totalAmount");
        const sum = cartItem.reduce((a, b) => a + Number(b.price) * b.qty ,0);
        totalAmount.innerHTML = `Rs ${sum + 100} /-`
        getCartItems();
}

const deleteCartItem = (i) => {
    let cartItem = JSON.parse(localStorage.getItem("cart")) || [];
    cartItem.splice(Number(i), 1);
    localStorage.setItem("cart", JSON.stringify(cartItem));
    const totalAmount = document.getElementById("totalAmount");
    const sum = cartItem.reduce((a, b) => a + Number(b.price) * b.qty ,0)
    totalAmount.innerHTML = `Rs ${sum + 100} /-`
    console.log(i);
    localStorage.removeItem("cart");
    totalAmount.innerHTML = '';
    getCartItems();
}

const getCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart"));
    const cart = document.getElementById("cart");
    cart.innerHTML = "";
    if(cartItems){
        for(let i = 0; i < cartItems.length; i++){
            console.log(cartItems[i]);
            
            let {image, name, serving, price, qty} = cartItems[i];
            cart.innerHTML += `<div class="card w-100 mb-3">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div class="d-flex">
                                <img class="rounded" width="150" src=${image} alt="">
                            <div class="ps-4">
                                <h3 class="card-title">${name}</h3>
                                <h6 class="card-title">Rs.${price} /- ${qty} = ${price*qty}</h6>
                                <p class="card-text">Serves ${serving}</p>
                            </div>
                        </div>
                        <div>
                            <a onClick = "deleteCartItem('${i}')" class="btn btn-primary py-2"><i class="fa-solid fa-trash"></i></a>
                        </div>
                    </div>
                </div>`
        }
    }
}
getCartItems()

window.addToCart = addToCart;
window.updQty = updQty;
window.deleteCartItem = deleteCartItem;