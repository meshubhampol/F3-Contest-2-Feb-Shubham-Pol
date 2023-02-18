const url = 'https://free-food-menus-api-production.up.railway.app/burgers';

let data = [];
function getMenu() {
    let wait = fetch(url).then((response) => response.json()).then(
        (result) => {
            data = result;
            console.log(data);
            result.map(showData);
        }
    )
    wait.then(() => {
        takeOrder();
    })
}

const itemParent = document.getElementById('item-section');

function showData(item) {
    let src = item.img;
    let id = item.id;
    let name = item.name;
    let dsc = item.dsc;
    let price = item.price;
    let rating = item.rate;

    let itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.id = id;
    itemDiv.innerHTML = `
        <div class="img-section">
            <img src="${src}" alt="food">
        </div>
        <div class="text-section">
            <h3>${name}</h3>
            <div class="dsc">${dsc} <br></div>
            <div class="price"><span>Price: </span> ${price}</div>
            <div class="rating"><span>Rating: </span> ${rating}</div>
        </div>
   `;
    itemParent.appendChild(itemDiv);
}

getMenu();



let loader = document.getElementById('loader');

let textDiv = document.getElementById('loading-text');

function takeOrder() {
    let promise = new Promise((resolve, reject) => {
        let check = [];
        setTimeout(() => {

            // selecting 3 random burgers
            for (let i = 0; i < 3; i++) {
                let ran = parseInt(Math.random() * data.length);

                // ignoring the already selected burger
                while (check[ran] === 1) {
                    ran = parseInt(Math.random() * data.length);
                }
                check[ran] = 1;

                selectItem(data[ran]);
            }
            resolve(data);
        }, 2500);
    });


    promise.then((obj) => {
        setTimeout(() => {
            placingOrderLoader();
            orderPrep()
        }, 1000);
    });
}


// selecting the item
function selectItem(item) {
    let element = document.getElementById(item.id);

    // scrolling to that element
    element.scrollIntoView(true);

    // highlighting the element
    element.classList.add('selected');
}

function placingOrderLoader() {
    itemParent.classList.add('fade');
    loader.classList.remove('hidden');
};

function orderPrep() {
    let promise2 = new Promise((resolve, reject) => {
        let obj = {};
        setTimeout(() => {
            obj["order_status"] = true;
            obj["paid"] = false;
            textDiv.innerHTML = "Preparing Order";
            resolve(obj);
        }, 1500);
    })

    promise2.then((obj) => {
        console.log(obj);
        payOrder(obj);
    })
}

function payOrder(obj) {
    let promise3 = new Promise((resolve, reject) => {
        textDiv.innerHTML = "Processing Payment";
        setTimeout(() => {
            obj.paid = true;
            resolve(obj);
        }, 1000);
    })
    promise3.then((obj) => {
        thankyouFnc(obj);
    });
}

function thankyouFnc(obj) {
    let success = new Promise((resolve, reject) => {
        document.getElementById('loading').classList.add('hidden');
        textDiv.innerHTML = "Success!";
        textDiv.style.fontSize="32";
        textDiv.style.color = "#00a500";
        setTimeout(()=> {
            resolve('success');
        },1000);
    });

    success.then((result) => {
        alert("Thank You for placing the order!");
        loader.classList.add('hidden');
        itemParent.classList.remove('fade');
    });
}