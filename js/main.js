
//Start Faux Cart Code
const
    // set the name of your shop here
    shopID = 'prehistoric-pours',
    // match the following attributes to the classes on your products
    productClass = 'product',
    imageClass = 'menu-card-image',
    nameClass = 'menu-card-name',
    descClass = 'menu-card-desc',
    priceClass = 'menu-card-price',
    // match the following attributes to your cart total elements
    cartTotalID = 'cartTotal',
    cartItemCountID = 'cartItemCount';


// check if shop exists in local storage, create it if not
if (localStorage.getItem(shopID) === null) {
    localStorage.setItem(shopID, JSON.stringify({ cart: [] }));
}

//initialize the shop object
let shop = JSON.parse(localStorage.getItem(shopID));

// Define the Product class
class Product {
    constructor(name, desc, price, imgSrc, qty = 1) {
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imgSrc = imgSrc;
        this.qty = qty;
    }
}

function addToCart(e, card) {
    // prevent default link behavior
    e.preventDefault();
    // get the product attributes from DOM
    let product = card.querySelectorAll("*");
    let dialog = document.querySelector("#add-notification");
    dialog.classList.replace("overlay-invisible", "overlay-visible")
    setTimeout(() => { dialog.classList.replace("overlay-visible", "overlay-invisible") }, 750);
    // create an array to hold product attributes
    let attributes = ['name', 'desc', 'price', 'imgSrc'];
    // loop through the product attributes and assign them to the array
    for (let node of product) {

        if (node.className === nameClass) attributes[0] = node.innerText;
        if (node.className === descClass) attributes[1] = node.innerText;
        if (node.className === priceClass) attributes[2] = parseFloat(node.innerText);
        if (node.className === imageClass) attributes[3] = node.currentSrc;
    }
    // check if any attributes are undefined
    if (attributes.includes(undefined)) {
        console.log("Error: One or more attributes are undefined, check your class names");
        return; // exit function
    }
    // check if the item is already in the cart
    for (let item of shop.cart) {
        if (item.name === attributes[0]) {
            // increase quantity by 1
            item.qty++;
            // update local storage
            localStorage.setItem(shopID, JSON.stringify(shop));
            console.log("Item already in cart, increased quantity by 1");
            updateCartTotals()
            return; // exit function
        }
    }
    // add item to cart
    shop.cart.push(new Product(...attributes));
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // update cart totals
    updateCartTotals()
}

function cartTotal() {
    let total = 0;
    let itemCount = 0
    // check if cart is empty
    if (shop.cart.length === 0) return [total, itemCount];
    // loop through cart and add up total
    for (let item of shop.cart) {
        total += item.price * item.qty;
        itemCount += item.qty;
    }
    // return total and item count
    return [total, itemCount]
}

function updateCartTotals() {
    let total = cartTotal();
    // check if cartTotal element exists and update if applicable
    if (document.getElementById(cartTotalID) !== null) {
        document.getElementById(cartTotalID).innerHTML = `${total[0].toFixed(2)}`;
    }
    // check if cartItemCount element exists and update if applicable
    if (document.getElementById(cartItemCountID) !== null) {
        document.getElementById(cartItemCountID).innerHTML = `${total[1]}`;
    }
}
function checkoutCart() {
    document.getElementById("overlay-container").classList.replace("overlay-invisible", "overlay-visible")
}

function updateCart() {
    let cart = document.getElementById('cart-list');
    let total = 0;
    // check if cart is empty
    if (shop.cart.length === 0) {
        cart.innerHTML = '<h3>Your cart is empty</h3>';
        return;
    }
    // loop through cart and add items to cart element
    for (let [index, item] of shop.cart.entries()) {
        total += item.price * item.qty;
        cart.innerHTML += `
            <li class="cartcard rocky-texture">
                <figure id="cart-fig"><img src="${item.imgSrc}" alt="${item.name}"></figure>
                <section class="cart-content" id="${index}">
                    <h2 class="cart-item">${item.name}</h2>
                    <p>${item.desc}</p>
                    <p class="cart-item-price">Price: $${item.price.toFixed(2)}</p>
                    <button class="addBtn modQty btnrow"><img src="../media/icons/plus.svg" alt="plus symbol"></button>
                    <p class="cart-item-quantity btnrow">Quantity: ${item.qty}</p>
                    <button class="subBtn modQty btnrow"><img src="../media/icons/minus.svg" alt="minus symbol"></button>
                    <p class="cart-subtotal">Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
                </section>
            </li>
        `;
    }
    // add total to cart element
    cart.innerHTML += `
    <div class="cartTotal">
        <h3>Total: $${total.toFixed(2)}</h3>
        <a href="#" id="checkoutCart" class="btn">Checkout</a>
        <a href="#" id="emptyCart" class="btn">Empty Cart</a>
    </div>
    `;
    // add event listeners to buttons
    document.querySelectorAll('.removeBtn').forEach(button => button.addEventListener('click', removeItem));
    document.querySelectorAll('.modQty').forEach(button => button.addEventListener('click', incrementItem));
    document.getElementById('emptyCart').addEventListener('click', emptyCart);
    document.getElementById('checkoutCart').addEventListener('click', checkoutCart);

}

function removeItem(e) {
    e.preventDefault();
    let index = e.target.id;
    // remove item from cart
    shop.cart.splice(index, 1);
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // reload page to update cart
    location.reload();
}

function incrementItem(e) {
    e.preventDefault();
    let index = e.target.parentElement.parentElement.id;
    let action = e.target.parentElement.classList;
    console.log(index);
    console.log(action);
    if (action.contains("addBtn")) {
        shop.cart[index].qty++;
    }
    if (action.contains("subBtn")) {
        shop.cart[index].qty--;
    }
    // remove item from cart if reduced to 0 qty
    if (shop.cart[index].qty == 0) {
        shop.cart.splice(index, 1);
    }
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // reload page to update cart
    location.reload();
}

function emptyCart() {
    // empty cart
    shop.cart = [];
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // reload page to update cart
    location.reload();
}

//Road to never nester
//Start Overlay Code
//Closes an overlay
function exitOverlay(overlay) {
    console.log(overlay, overlay.parentElement)
    // Replace the visible class to make the overlay invisible
    overlay.parentElement.classList.replace("overlay-visible", "overlay-invisible")
}
function exitPayOverlay(e) {
    e.preventDefault();
    exitOverlay(document.getElementById("checkout-payment"));
}

//Scrapes the content for use in an overlay
function scrapeItem(card) {
    //Query for all content needed
    let img = card.querySelector("figure > img").src,
        name = card.querySelector("figure > figcaption").innerText,
        desc = card.querySelector(".menu-card-desc").innerText,
        price = card.querySelector(".menu-card-price").innerText
    //return as tuple
    return { img, name, desc, price }
}
//Sets the content for an overlay
function setOverlay({ img, name, desc, price }) {
    //Query for the overlay and set all the content
    let overlay = document.querySelector("#overlay-product")
    overlay.querySelector("#product-fig > #product-image").src = img
    overlay.querySelector("#product-name").innerText = name
    overlay.querySelector("#product-descriptor").innerText = desc
    overlay.querySelector("#product-price").innerText = price

    //return the overlay for use in the master function
    return overlay
}
//Master function for opening an item overlay
function openItemOverlay(card) {
    console.log(card)
    // Scrape the card for content and set the overlay to that content
    let overlay = setOverlay(scrapeItem(card))
    // Replace the invisible class to make the overlay visible
    overlay.parentElement.classList.replace("overlay-invisible", "overlay-visible")
    //Set the 'onClick' event to 'exitOverlay'. Preventing href redirect and calling exit function
    overlay.querySelector(".exit-overlay").onclick = (e) => { e.preventDefault(); exitOverlay(overlay) }
    // check if addToCart buttons exist
    if (document.querySelectorAll('.addToCart') === null) return;
    let cartButton = document.querySelector('.addToCart');
    // Adapt faux cart add to overlay system
    cartButton.onclick = e => {
        addToCart(e, card)
    }
    //cartButton.forEach(button => button.addEventListener('click', addToCart))

}

function nav(e) {
    e.preventDefault()
    !document.querySelector(".hamburger").classList.replace("unexpanded", "expanded") ? document.querySelector(".hamburger").classList.replace("expanded", "unexpanded") : console.log("what")
    !document.querySelector("#navlist").classList.replace("navlist-closed", "navlist-opened") ? document.querySelector("#navlist").classList.replace("navlist-opened", "navlist-closed") : console.log("what")

}

// Add Event listner when DOM is ready
// Wait for DOM to load

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector(".exit-overlay") !== null) {
        document.querySelector(".exit-overlay").addEventListener('click', exitPayOverlay);
    }
    // check if cart element exists
    if (document.getElementById('cart-list') !== null) {
        updateCart();
    }
    // check if cart has items and update totals
    if (shop.cart.length >= 0) {
        updateCartTotals();
    }

    // Log shop object to console
    console.log("Ready", shop.cart);

    // Query for elements with a '.card' class
    document.querySelectorAll(".card").forEach((card) => {
        //Set the 'onClick' event to 'openItemOverlay'. Preventing href redirect and calling master function
        card.querySelector("figure > img").onclick = (e) => { e.preventDefault(); openItemOverlay(card) }
    })
    document.querySelector("#navlist > .hamburger").onclick = nav
});

