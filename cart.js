
document.addEventListener("DOMContentLoaded", function () {
    let cartContainer = document.querySelector(".cart-container");

    // Select all .order-summary elements
    let orderSummaryElements = document.querySelectorAll(".order-summary");
    let itemsTotalElement = orderSummaryElements[0]?.querySelector("p:nth-child(2)"); // Items total
    let shippingElement = orderSummaryElements[1]?.querySelector("p:nth-child(2)"); // Shipping fee
    let totalAmountElement = orderSummaryElements[2]?.querySelector("p:nth-child(2)"); // Final total

    // Select the total inside the payment popup
    let popupTotalElement = document.getElementById("popupTotalAmount");
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    function calculateTotal() {
        let itemsTotal = cart.reduce((sum, item) => {
            let itemPrice = parseFloat(item.price.replace(/[$,]/g, "")); // Ensure price is parsed correctly
            return sum + (itemPrice * item.quantity);
        }, 0);
    
        let shippingFee = 5.00;
        let grandTotal = itemsTotal + shippingFee;
    
        // Update the UI in the order summary
        if (itemsTotalElement) itemsTotalElement.textContent = `$${itemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        if (shippingElement) shippingElement.textContent = `$${shippingFee.toFixed(2)}`;
        if (totalAmountElement) totalAmountElement.textContent = `$${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        if (popupTotalElement) popupTotalElement.textContent = `$${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    
        // Update item prices in each cart product card
        document.querySelectorAll(".product-card").forEach((card, index) => {
            let totalAmountElement = card.querySelector(".total-amount");
            if (totalAmountElement) {
                let itemPrice = parseFloat(cart[index].price.replace(/[$,]/g, ""));
                let itemTotal = itemPrice * cart[index].quantity;
                totalAmountElement.textContent = `$${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            }
        });
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
                    <div class="total-amount">${item.price}</div>
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
                    renderCart();
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

    /*** SHIPPING VALIDATION ***/
    const shippingInputs = document.querySelectorAll(".checkout-container input");
    const checkoutButton = document.querySelector(".checkout-button");
    const payButton = document.querySelector(".pay-btn");

    // Create a warning message
    const warningMessage = document.createElement("p");
   
    checkoutButton?.parentNode.insertBefore(warningMessage, checkoutButton);

    function validateShippingInfo() {
        let allFilled = true;

        shippingInputs.forEach(input => {
            if (input.value.trim() === "") {
               
                allFilled = false;
            } else {
                input.style.border = ""; // Remove highlight if filled
            }
        });

        warningMessage.style.display = allFilled ? "none" : "block";
        return allFilled;
    }

    // Enable/disable checkout button based on input validation
    shippingInputs.forEach(input => {
        input.addEventListener("input", () => {
            if (validateShippingInfo()) {
                checkoutButton?.removeAttribute("disabled");
            } else {
                checkoutButton?.setAttribute("disabled", "true");
            }
        });
    });

    checkoutButton?.addEventListener("click", function (event) {
        if (!validateShippingInfo()) {
            event.preventDefault(); // Prevent proceeding if fields are empty
        } else {
            openPopup(); // Open payment popup if valid
        }
    });

    /*** PAYMENT CONFIRMATION ***/
    payButton?.addEventListener("click", function () {
        alert("Order has been placed successfully!");
        closePopup(); // Close the payment popup
        cart = []; // Reset cart array
        renderCart(); // Re-render cart to reflect changes
    });
});
