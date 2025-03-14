let list = document.querySelectorAll(".navigation li");
let activeItem = document.querySelector(".navigation li.hovered") || null;

function activeLink() {
  if (activeItem) {
    activeItem.classList.remove("hovered");
  }
  this.classList.add("hovered");
  activeItem = this;

  let link = this.querySelector("a");
  if (link) {
    localStorage.setItem("activePage", link.getAttribute("href"));
  }
}

list.forEach((item) => item.addEventListener("click", activeLink));

document.addEventListener("DOMContentLoaded", () => {
  let savedPage = localStorage.getItem("activePage");
  
  if (savedPage) {
    list.forEach((item) => {
      let link = item.querySelector("a");
      if (link && link.getAttribute("href") === savedPage) {
        item.classList.add("hovered");
        activeItem = item;
      }
    });
  } else {
    document.querySelector("ul li").click();
  }
});

list.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    if (activeItem && activeItem !== this) {
      activeItem.classList.remove("hovered");
    }
    this.classList.add("hovered");
  });

  item.addEventListener("mouseleave", function () {
    this.classList.remove("hovered");
    if (activeItem) {
      activeItem.classList.add("hovered");
    }
  });
});


function openPopup() {
  document.getElementById("paymentPopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("paymentPopup").style.display = "none";
}

function changeQuantity(amount) {
  let quantityInput = document.getElementById("quantity");
  let totalAmount = document.getElementById("total");

  let currentQuantity = parseInt(quantityInput.value);
  let newQuantity = currentQuantity + amount;

  if (newQuantity > 0) {
      quantityInput.value = newQuantity;
      totalAmount.innerText = `$${newQuantity * 10}`;
  }
}

function removeItem() {
  document.querySelector(".product-card").remove();
}









function filterProducts(category) {
  const products = document.querySelectorAll('.product'); // Assuming product items have this class
  
  products.forEach(product => {
      if (category === 'all') {
          product.style.display = 'block';
      } else {
          product.style.display = product.dataset.part === category ? 'block' : 'none';
      }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".categories a").forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          const category = this.getAttribute("data-part");
          filterProducts(category);
      });
  });
});
// Function to store product details in localStorage
function saveProductToLocalStorage(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
}

// Function to get product details from localStorage
function getProductFromLocalStorage() {
  const storedProduct = localStorage.getItem("selectedProduct");
  return storedProduct ? JSON.parse(storedProduct) : null;
}

// Function to get product details from URL (if available)
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
      name: params.get("name"),
      price: params.get("price"),
      image: params.get("image"),
      subImages: [
          params.get("sub1"),
          params.get("sub2"),
          params.get("sub3"),
          params.get("sub4"),
      ].filter(img => img) // Filter out any null values
  };
}

// Check if product details exist in URL (first-time visit)
let product = getQueryParams();
if (!product.name) {
  // If no URL params, try to load from localStorage
  product = getProductFromLocalStorage();
}

// If product details are available, update the UI
if (product) {
  document.getElementById("product_name").textContent = product.name;
  document.getElementById("product_price").textContent = "$" + product.price;
  document.getElementById("main_viewed_image").src = product.image;

  // Update sub-images dynamically
  const subImagesContainer = document.getElementById("sub_images");
  subImagesContainer.innerHTML = ""; // Clear existing content

  product.subImages.forEach((imgSrc, index) => {
      const li = document.createElement("li");
      const input = document.createElement("input");
      input.type = "image";
      input.className = "sub-image";
      input.src = imgSrc;
      input.alt = `Sub-image ${index + 1}`;

      // Click event to change main image
      input.addEventListener("click", function () {
          document.getElementById("main_viewed_image").src = imgSrc;
      });

      li.appendChild(input);
      subImagesContainer.appendChild(li);
  });

  // Store the product in localStorage
  saveProductToLocalStorage(product);
}




document.getElementById("add_to_cart").addEventListener("click", function () {
  let currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
      // If no user is logged in, show the login modal
      document.getElementById("loginModal").style.display = "block";
      return;
  }

  // Extract product details
  let productName = document.getElementById("product_name").textContent;
  let productPrice = document.getElementById("product_price").textContent.trim();
  let productImage = document.getElementById("main_viewed_image").src;
  let quantity = parseInt(document.getElementById("quantity").value, 10);
  let totalAmount = document.getElementById("total_amount").textContent.trim();

  // Remove commas and extract numerical value from price
  let priceValue = parseFloat(productPrice.replace(/[$,]/g, ""));
  let totalValue = parseFloat(totalAmount.replace(/[$,]/g, ""));

  // Create product object
  let product = {
      name: productName,
      price: "$" + priceValue.toLocaleString(), // Store formatted price
      image: productImage,
      quantity: quantity,
      total: "$" + totalValue.toLocaleString() // Store formatted total
  };

  // Retrieve existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Check if the item is already in the cart
  let existingItem = cart.find(item => item.name === product.name);
  
  if (existingItem) {
      // If the item exists, update quantity and total
      existingItem.quantity += quantity;
      existingItem.total = "$" + (priceValue * existingItem.quantity).toLocaleString();
  } else {
      // Otherwise, add a new item
      cart.push(product);
  }

  // Save back to localStorage
  localStorage.setItem("cartItems", JSON.stringify(cart));

  console.log("Cart Updated:", cart);

  // 🚀 Redirect to cart.html after adding the item
  window.location.href = "cart.html";
});

// 🔄 Update total amount dynamically when quantity changes
document.getElementById("quantity").addEventListener("input", function () {
  let productPrice = parseFloat(document.getElementById("product_price").textContent.replace(/[$,]/g, ""));
  let quantity = parseInt(this.value, 10);

  if (quantity < 1) {
      this.value = 1; // Ensure minimum value is 1
      quantity = 1;
  }

  let newTotal = productPrice * quantity;
  document.getElementById("total_amount").textContent = "$" + newTotal.toLocaleString();
});






document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginbutton");
  const signupButton = document.getElementById("signupbutton");

  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const switchToSignup = document.getElementById("switchtosignup");
  const switchToLogin = document.getElementById("switchtologin");

  const loginMessage = document.getElementById("loginMessage");
  const signupMessage = document.getElementById("signupMessage");

  // Open Modals
  loginButton.addEventListener("click", () => loginModal.style.display = "block");
  signupButton.addEventListener("click", () => signupModal.style.display = "block");

  // Close Modals
  document.querySelectorAll(".close").forEach(btn => {
      btn.addEventListener("click", function () {
          document.getElementById(this.getAttribute("data-modal")).style.display = "none";
      });
  });

  // Switch Between Login & Signup Modals
  switchToSignup.addEventListener("click", () => {
      loginModal.style.display = "none";
      signupModal.style.display = "block";
  });

  switchToLogin.addEventListener("click", () => {
      signupModal.style.display = "none";
      loginModal.style.display = "block";
  });

  // Signup Functionality
  signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let firstName = document.getElementById("firstName").value;
      let lastName = document.getElementById("lastName").value;
      let email = document.getElementById("signupEmail").value;
      let password = document.getElementById("signupPassword").value;
      let confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
          signupMessage.innerText = "Passwords do not match!";
          signupMessage.style.color = "red";
          return;
      }

      if (localStorage.getItem(email)) {
          signupMessage.innerText = "User already exists!";
          signupMessage.style.color = "red";
          return;
      }

      let userData = { firstName, lastName, email, password };
      localStorage.setItem(email, JSON.stringify(userData));

      signupMessage.innerText = "Signup successful! Please login.";
      signupMessage.style.color = "green";
      signupForm.reset();
      setTimeout(() => {
          signupModal.style.display = "none";
          loginModal.style.display = "block";
      }, 1500);
  });

  // Login Functionality
  loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let email = document.getElementById("loginEmail").value;
      let password = document.getElementById("loginPassword").value;

      let userData = localStorage.getItem(email);
      if (!userData) {
          loginMessage.innerText = "User not found!";
          loginMessage.style.color = "red";
          return;
      }

      let user = JSON.parse(userData);
      if (user.password !== password) {
          loginMessage.innerText = "Incorrect password!";
          loginMessage.style.color = "red";
          return;
      }

      // Save current user session
      localStorage.setItem("currentUser", email);
      updateUI();
      loginMessage.innerText = "Login successful!";
      loginMessage.style.color = "green";

      setTimeout(() => {
          loginModal.style.display = "none";
      }, 1000);
  });

  // Logout Functionality
  signupButton.addEventListener("click", function () {
      if (localStorage.getItem("currentUser")) {
          localStorage.removeItem("currentUser");
          updateUI();
      }
  });

  // Update UI Based on Login Status
  function updateUI() {
      let currentUser = localStorage.getItem("currentUser");

      if (currentUser) {
          let user = JSON.parse(localStorage.getItem(currentUser));
          loginButton.innerText = user.firstName;
          signupButton.innerText = "Logout";
      } else {
          loginButton.innerText = "Login";
          signupButton.innerText = "Signup";
      }
  }

  // Initialize UI on page load
  updateUI();
});












