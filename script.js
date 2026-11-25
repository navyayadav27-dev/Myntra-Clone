
// =====================================
// PRODUCT DATA
// =====================================

const products = [
    {id:1,name:"Nike Sports Shoes",brand:"Nike",category:"Men",price:2999,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"},
    {id:2,name:"Floral Summer Dress",brand:"Roadster",category:"Women",price:1499,image:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500"},
    {id:3,name:"Nike Running Shoes",brand:"Nike",category:"Men",price:3499,image:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500"},
    {id:4,name:"Casual Women Dress",brand:"H&M",category:"Women",price:1999,image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"},
    {id:5,name:"Roadster Casual Shirt",brand:"Roadster",category:"Men",price:999,image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"},
    {id:6,name:"White Sneakers",brand:"Puma",category:"Women",price:2499,image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"},
    {id:7,name:"Classic Denim Jeans",brand:"Levis",category:"Men",price:1799,image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"},
    {id:8,name:"Elegant Party Dress",brand:"H&M",category:"Women",price:2799,image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500"}
];

// =====================================
// SAVED DATA
// =====================================

let selectedCategory = "All";
let searchText = "";
let sortOrder = "default";

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let bag = JSON.parse(localStorage.getItem("bag")) || [];

const isWishlistPage = location.pathname.endsWith("wishlist.html");

// =====================================
// HOMEPAGE PRODUCT DISPLAY
// =====================================

function displayProducts() {

    const container = document.getElementById("productContainer");
    const count = document.getElementById("resultCount");

    if (!container) return;

    let filtered = products.filter(product => {

        const categoryMatch =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchMatch =
            product.name.toLowerCase().includes(searchText) ||
            product.brand.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        const wishlistMatch =
            !isWishlistPage || wishlist.includes(product.id);

        return categoryMatch && searchMatch && wishlistMatch;
    });

    if (sortOrder === "low") {
        filtered.sort((a,b) => a.price - b.price);
    }

    if (sortOrder === "high") {
        filtered.sort((a,b) => b.price - a.price);
    }

    if (sortOrder === "az") {
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    }

    if (sortOrder === "za") {
        filtered.sort((a,b) => b.name.localeCompare(a.name));
    }

    if (count) {
        count.textContent = `${filtered.length} products found`;
    }

    if (filtered.length === 0) {
        container.innerHTML =
            '<p class="empty-message">No products found!</p>';
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card">

            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}"
                onerror="this.src='https://placehold.co/400x400?text=Product'">
            </a>

            <div class="product-info">

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.brand}
                    </a>
                </h3>

                <p>${product.name}</p>

                <span class="price">₹${product.price}</span>

                <br>

                <button class="wishlist-btn"
                    onclick="toggleWishlist(${product.id})">
                    ${wishlist.includes(product.id)
                    ? "♥ Remove Wishlist"
                    : "♡ Add Wishlist"}
                </button>

            </div>
        </div>
    `).join("");
}

// =====================================
// SEARCH
// =====================================

function searchProducts() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    searchText = input.value.trim().toLowerCase();

    displayProducts();
}

// =====================================
// CATEGORY FILTER
// =====================================

function filterCategory(category) {

    selectedCategory = category;

    displayProducts();
}

// =====================================
// SORTING
// =====================================

function sortProducts() {

    const select = document.getElementById("sortSelect");

    if (!select) return;

    sortOrder = select.value;

    displayProducts();
}

// =====================================
// WISHLIST
// =====================================

function toggleWishlist(id) {

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    displayProducts();
}

// =====================================
// PRODUCT DETAILS
// =====================================

function displayProductDetails() {

    const container = document.getElementById("productDetails");

    if (!container) return;

    const id = Number(new URLSearchParams(location.search).get("id"));

    const product = products.find(item => item.id === id);

    if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    container.innerHTML = `
        <img src="${product.image}" alt="${product.name}">

        <div class="details-info">

            <h2>${product.brand}</h2>

            <h3>${product.name}</h3>

            <h2>₹${product.price}</h2>

            <p>Category: ${product.category}</p>

            <p>
                A stylish and comfortable product.
                Perfect for your everyday fashion needs.
            </p>

            <h3>Select Size</h3>

            <div class="size-options">
                ${["S","M","L","XL"].map(size => `
                    <label>
                        <input type="radio" name="size" value="${size}">
                        ${size}
                    </label>
                `).join("")}
            </div>

            <button class="primary-btn" onclick="addToBag(${product.id})">
                ADD TO BAG
            </button>

            <button class="wishlist-btn"
                onclick="toggleWishlist(${product.id})">
                ♡ Add to Wishlist
            </button>

        </div>
    `;
}

// =====================================
// ADD PRODUCT TO BAG
// =====================================

function addToBag(id) {

    const selectedSize = document.querySelector(
        'input[name="size"]:checked'
    );

    if (!selectedSize) {
        alert("Please select a size first!");
        return;
    }

    const existing = bag.find(item =>
        item.id === id && item.size === selectedSize.value
    );

    if (existing) {
        existing.quantity++;
    } else {
        bag.push({
            id: id,
            size: selectedSize.value,
            quantity: 1
        });
    }

    localStorage.setItem("bag", JSON.stringify(bag));

    alert("Product added to your bag!");

    window.location.href = "bag.html";
}

// =====================================
// DISPLAY SHOPPING BAG
// =====================================

function displayBag() {

    const container = document.getElementById("bagContainer");

    const checkout = document.getElementById("checkoutSection");

    if (!container || !checkout) return;

    if (bag.length === 0) {

        container.innerHTML =
            '<p class="empty-message">Your shopping bag is empty!</p>';

        checkout.innerHTML =
            '<a href="index.html" class="primary-btn">CONTINUE SHOPPING</a>';

        return;
    }

    let total = 0;

    container.innerHTML = bag.map((item,index) => {

        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        total += product.price * item.quantity;

        return `
            <div class="bag-item">

                <img src="${product.image}" alt="${product.name}">

                <div class="bag-info">

                    <h3>${product.brand}</h3>

                    <p>${product.name}</p>

                    <p>Size: ${item.size}</p>

                    <p>Price: ₹${product.price}</p>

                    <p>Quantity: ${item.quantity}</p>

                    <button onclick="changeQuantity(${index},-1)">−</button>

                    <button onclick="changeQuantity(${index},1)">+</button>

                    <button onclick="removeFromBag(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    }).join("");

    checkout.innerHTML = `
        <div class="checkout-box">

            <h3>Price Details</h3>

            <h2>Total Amount: ₹${total}</h2>

            <h3>Choose Payment Method</h3>

            <select id="paymentMethod">
                <option value="">Select Payment Method</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
            </select>

            <button class="primary-btn" onclick="placeOrder()">
                PLACE ORDER
            </button>

        </div>
    `;
}

// =====================================
// CHANGE QUANTITY
// =====================================

function changeQuantity(index,change) {

    bag[index].quantity += change;

    if (bag[index].quantity <= 0) {
        bag.splice(index,1);
    }

    localStorage.setItem("bag",JSON.stringify(bag));

    displayBag();
}

// =====================================
// REMOVE FROM BAG
// =====================================

function removeFromBag(index) {

    bag.splice(index,1);

    localStorage.setItem("bag",JSON.stringify(bag));

    displayBag();
}

// =====================================
// PLACE ORDER
// =====================================

function placeOrder() {

    const payment = document.getElementById("paymentMethod").value;

    if (!payment) {
        alert("Please select a payment method!");
        return;
    }

    if (bag.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    const total = bag.reduce((sum,item) => {

        const product = products.find(p => p.id === item.id);

        return sum + (product ? product.price * item.quantity : 0);

    },0);

    const deliveryDate = new Date();

    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const order = {
        payment: payment,
        total: total,
        deliveryDate: formattedDate,
        products: bag
    };

    localStorage.setItem("lastOrder",JSON.stringify(order));

    bag = [];

    localStorage.setItem("bag",JSON.stringify(bag));

    document.getElementById("bagContainer").innerHTML = "";

    document.getElementById("checkoutSection").innerHTML = "";

    document.getElementById("orderConfirmation").innerHTML = `
        <h2>🎉 Order Placed Successfully!</h2>

        <p>Thank you for shopping with us.</p>

        <p><strong>Total Amount:</strong> ₹${total}</p>

        <p><strong>Payment Method:</strong> ${payment}</p>

        <p><strong>Expected Delivery:</strong> ${formattedDate}</p>

        <a href="index.html" class="primary-btn">
            CONTINUE SHOPPING
        </a>
    `;
}

// =====================================
// SEARCH EVENT
// =====================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input",searchProducts);

    searchInput.addEventListener("keydown",event => {

        if (event.key === "Enter") {
            searchProducts();
        }

    });
}

// =====================================
// START WEBSITE
// =====================================

displayProducts();
displayProductDetails();
displayBag();
