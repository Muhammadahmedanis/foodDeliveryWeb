import {db, addDoc, getDoc, collection, getDocs, doc, serverTimestamp, updateDoc} from './firebase.js';

let Order = async() => {
    const orderCart = document.getElementById("cart");
    const customerName = document.getElementById("customerName");
    const customerNumber = document.getElementById("customerNumber");
    const customerAddress = document.getElementById("customerAddress");
    const cart = localStorage.getItem("cart");
    console.log(customerName.value, customerNumber.value, customerAddress.value);
    console.log(cart);
    let cartItem = JSON.parse(localStorage.getItem("cart")) || [];
    const sum = cartItem.reduce((a,b) => a + Number(b.price) * b.qty, 0);
    const totalAmount = document.getElementById("totalAmount");

    const orderDetail = {
        cartItem,
        customerName: customerName.value,
        customerNumber: customerNumber.value,
        customerAddress: customerAddress.value,
        status: "pending",
        timestamp: serverTimestamp(),
        orderAmount: 230,
        delieryCharges: 100,
        totalAmount: sum + 100,
    }
    console.log(orderDetail);
    let closeBtn = document.getElementById("btn-close") 
    const docRef = await addDoc(collection(db, "orders"), orderDetail)
    closeBtn.click();
    Swal.fire({
        position: "center center",
        icon: "success",
        title: "You order has been placed!",
        showConfirmButton: false,
        timer: 1500
    });
    // Swal.fire({
    //     title: "You order has been placed!",
    //     icon: "success",
    //     timer: 1500,
    // });
    customerName.value = '';
    customerNumber.value = '';
    customerAddress.value = '';
    orderCart.innerHTML = '';
    totalAmount.innerHTML = '';
    localStorage.removeItem("cart"); 
}

const placeOrder =document.getElementById("placeOrder");
placeOrder && placeOrder.addEventListener("click", Order);


const getAllOrder = async() => {
    const allOrder = document.getElementById("allOrder");
    const mainContent = document.getElementById("mainContent");
    const spinner = document.querySelector(".spinner");
    let ind = 0;
    const q = collection(db, "orders");
    const querySnapshot = await getDocs(q);
    if(allOrder){
        allOrder.innerHTML = '';
    querySnapshot.forEach((doc) => {
        ind++;
        console.log("order",doc.data());
        let status  = doc.data().status;
        let statusColor = '';
        if(status === "pending"){
            statusColor = "text-bg-warning"
        }
        if(status === "delivered"){
            statusColor = "text-bg-success"
        }
            allOrder.innerHTML += ` <tr class="orderTable text-center">
            <th scope="row">${ind}</th>
            <td scope="col-2 col-lg-3">${doc.data().customerName}</td>
            <td scope="col-3 col-lg-3">${doc.data().customerNumber}</td>
            <td scope="col-3 col-lg-3">${doc.data().customerAddress}</td>
            <td scope="col-2"><span class="badge ${statusColor}">${doc.data().status}</span></td>
            <td scope="col-2">${doc.data().totalAmount}</td>
            <td scope="col-3"><button onClick = "viewOrderDetails('${doc.id}')" type="button" class="viewBtn btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            View details </button></td>
            </tr>
            `
            // console.log(typeof(doc.id);
        })
    }
    if(spinner || mainContent){
        spinner.style.display = "none";
        mainContent.style.display = "block";
    }
}
getAllOrder();

let updOrderId;

let viewOrderDetails = async(id) => {
    updOrderId = id;
    const orderStatus = document.getElementById("orderStatus");
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    orderStatus.value = docSnap.data().status;
    if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    const cart = document.getElementById("cart");
    cart.innerHTML = "";
        for(let i = 0; i < docSnap.data().cartItem.length; i++){
        let {image, name, serving, price, qty} = docSnap.data().cartItem[i];
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
                </div>
            </div>`
        }
    } else {
        console.log("No such document!");
    }
}

let updOrd = async() => {
    const closeBtn = document.getElementById("close-btn")
    const orderStatus = document.getElementById("orderStatus");
    const docRef = doc(db, "orders", updOrderId);
    await updateDoc(docRef, {
        status: orderStatus.value,
    });
    closeBtn.click();
    getAllOrder();
}

const updOrder = document.getElementById("updOrder");
updOrder && updOrder.addEventListener("click", updOrd)

window.viewOrderDetails = viewOrderDetails;