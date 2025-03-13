document.addEventListener("DOMContentLoaded", function () {
    let cartContainer = document.querySelector(".cart-container");

    // Select all .order-summary elements
    let orderSummaryElements = document.querySelectorAll(".order-summary");

    // Ensure we correctly map each section
    let itemsTotalElement = orderSummaryElements[0].querySelector("p:nth-child(2)"); // Items total
    let shippingElement = orderSummaryElements[1].querySelector("p:nth-child(2)"); // Shipping fee
    let totalAmountElement = orderSummaryElements[2].querySelector("p:nth-child(2)"); // Final total (items + shipping)

    // Select the total inside the payment popup
    let popupTotalElement = document.getElementById("popupTotalAmount");

    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    function calculateTotal() {
        let itemsTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace("$", "")) * item.quantity), 0);
        let shippingFee = 5.00;
        let grandTotal = itemsTotal + shippingFee;

        // Update the UI in the order summary
        if (itemsTotalElement) itemsTotalElement.textContent = `$${itemsTotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shippingFee.toFixed(2)}`;
        if (totalAmountElement) totalAmountElement.textContent = `$${grandTotal.toFixed(2)}`;

        // Update the total inside the payment popup
        if (popupTotalElement) popupTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
    }

    function renderCart() {
        cartContainer.innerHTML = ""; // Clear before re-rendering
        cart.forEach((item, index) => {
            let productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${item.image}" class="product-image" alt="${item.name}">
                
                <div class="product-info">
                    <div class="product-name">${item.name}</div>
                    <div class="price-tag">${item.price}</div>
                </div>
        
                <div class="quantity-section">
                    <div class="quantity-container">
                        <p>Quantity</p>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    </div>
                </div>
        
                <div class="total-section">
                    <div class="total-label">Total Amount</div>
                    <div class="total-amount">$${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}</div>
                </div>
        
                <button class="remove-btn" data-index="${index}">&#10005;</button>
            `;
            cartContainer.appendChild(productCard);
        });

        attachEventListeners();
        calculateTotal(); // Update order summary and popup total
    }

    function attachEventListeners() {
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("input", function () {
                let index = this.getAttribute("data-index");
                let newQuantity = parseInt(this.value);

                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    localStorage.setItem("cartItems", JSON.stringify(cart));
                    renderCart(); // Re-render cart with updated values
                }
            });
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cartItems", JSON.stringify(cart));
                renderCart();
            });
        });
    }

    renderCart(); // Initial render
});



document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".checkout-container input");
    const checkoutButton = document.querySelector(".checkout-button");

    // Create a warning message
    const warningMessage = document.createElement("p");
    warningMessage.textContent = "⚠ Please fill in all required fields before proceeding.";
    warningMessage.style.color = "red";
    warningMessage.style.fontSize = "14px";
    warningMessage.style.display = "none"; // Hidden by default
    checkoutButton.parentNode.insertBefore(warningMessage, checkoutButton);

    function checkInputs() {
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (allFilled) {
            checkoutButton.disabled = false;
            warningMessage.style.display = "none";
        } else {
            checkoutButton.disabled = true;
        }
    }

    checkoutButton.addEventListener("click", function (event) {
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (!allFilled) {
            event.preventDefault(); // Prevent button action
            warningMessage.style.display = "block"; // Show the message
        } else {
            openPopup(); // Proceed if all fields are filled
        }
    });

    // Listen for input changes
    inputs.forEach(input => {
        input.addEventListener("input", checkInputs);
    });

    checkInputs(); // Initial check
});




