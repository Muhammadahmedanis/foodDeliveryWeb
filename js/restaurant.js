import { storage, ref, uploadBytesResumable, getDownloadURL, db, addDoc, getDocs, collection } from './firebase.js';

const logo = document.getElementById("restaurantLogo");
const selectedLogo = document.getElementById("selectedLogo");
let file;

logo && logo.addEventListener("change", (e) => { 
    file = e.target.files[0];
    selectedLogo.style.display = "block";
    selectedLogo.src = URL.createObjectURL(file);
});

let uploadFile = (file, name) => {
    return new Promise((resolve, reject) => {
        const imaRef = ref(storage, `images/${name.split(" ").join("-")}`);
        const uploadTask = uploadBytesResumable(imaRef, file);

        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            console.error("Error in upload file:", error);
            reject(error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                resolve(downloadURL);
            }).catch((error) => reject(error));
        });
    });
};


const getAllRestaurant = async() => {
    const resturantList = document.getElementById("resturantList");
    if(resturantList){
            resturantList.innerHTML = '';
            const q = collection(db, "resturants");
            const querySnapshot = await getDocs(q);
            let ind = 0;
            querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            ind++;
            resturantList.innerHTML += `<tr>
            <th scope="row">${ind}</th>
            <td><img class="resLogoImg" src='${doc.data().img}' alt=""></td>
            <td>${doc.data().name}</td>
            <td>${doc.data().address}</td>
            </tr>`
        });
    }

}
getAllRestaurant()


const Submit = async () => {
    const closeBtn = document.getElementById("btn-close");
    const loader = document.getElementById("loader");
    const resturantName = document.getElementById("resturantName");
    const resturantAddress = document.getElementById("resturantAddress");

    loader.style.display = "block";
    try {
        const resturantImage = await uploadFile(file, resturantName.value);

        const docRef = await addDoc(collection(db, "resturants"), {
            name: resturantName.value,
            address: resturantAddress.value,
            img: resturantImage,
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    } finally {
        loader.style.display = "none";
        resturantName.value = '';
        resturantAddress.value = '';
        logo.value = '';
        selectedLogo.style.display = "none";
        closeBtn.click();
        getAllRestaurant();
    }
};

const submitRestaurant = document.getElementById("submitRestaurant");
submitRestaurant && submitRestaurant.addEventListener("click", Submit);


export{ uploadFile }