// Cart State
let cart = JSON.parse(localStorage.getItem("toyland_cart")) || [];

// Protect cart page - redirect if not logged in
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("cart.html")) return;

  checkAuthStatus();

  // if (!currentUser) {
  //   window.location.replace("login.html?redirect=cart.html");
  //   return;
  // }

  initTheme();
  renderCart();
});

// Add to Cart
function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price,
      image: product.image,
      quantity: quantity,
    });
  }

  saveCart();
  updateCartCount();
  showNotification(`${product.name} added to cart! 🎉`);
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

// Update Quantity
function updateCartQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item && item.quantity + change > 0) {
    item.quantity += change;

    saveCart();
    renderCart();
    updateCartCount();
  }
}

// Save Cart to localStorage
function saveCart() {
  localStorage.setItem("toyland_cart", JSON.stringify(cart));
}

// Update Cart Count in Navbar
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const counters = document.querySelectorAll("#cartCount, #cartCountMobile");

  counters.forEach((counter) => {
    if (totalItems > 0) {
      counter.textContent = totalItems;
      counter.classList.remove("hidden");
    } else {
      counter.classList.add("hidden");
    }
  });
}

// Render Cart Page
function renderCart() {
  const container = document.getElementById("cartItems");
  const emptyState = document.getElementById("emptyCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    checkoutBtn.disabled = true;
    updateTotals(0, 0, 0, 0);
    return;
  }

  emptyState.classList.add("hidden");
  checkoutBtn.disabled = false;
  container.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    container.innerHTML += `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex gap-4 fade-in">
                <img src="${item.image[0]}" alt="${item.name}" class="w-24 h-24 object-cover rounded-xl">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 dark:text-white mb-1">${item.name}</h3>
                    <p class="text-primary font-bold">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button onclick="updateCartQuantity(${item.id}, -1)" class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">-</button>
                            <span class="px-3 py-1 text-gray-800 dark:text-white">${item.quantity}</span>
                            <button onclick="updateCartQuantity(${item.id}, 1)" class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">+</button>
                        </div>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 text-sm underline">Remove</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-gray-800 dark:text-white">$${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
  });

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  updateTotals(subtotal, tax, total, shipping);
}

function updateTotals(subtotal, tax, total, shipping) {
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const shippingEl = document.getElementById("shipping");

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (shippingEl)
    shippingEl.textContent =
      shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;
}

function checkout() {
  // Validate cart
  if (!cart || cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }

  if (!currentUser) {
    window.location.replace("login.html?redirect=cart.html");
    return;
  }

  // Calculate totals first
  const totals = calculateTotals();

  // Confirm order
  const ok = confirm(
    `Complete your purchase?\n\n` +
      `Items: ${cart.length}\n` +
      `Subtotal: $${totals.subtotal.toFixed(2)}\n` +
      `Tax: $${totals.tax.toFixed(2)}\n` +
      `Shipping: ${totals.shipping === 0 ? "FREE" : "$" + totals.shipping.toFixed(2)}\n` +
      `Total: $${totals.total.toFixed(2)}`,
  );

  if (!ok) return;

  // SAVE ORDER FOR ALL CUSTOMERS (guests & logged in)
  try {
    const order = OrderManager.saveOrder(cart, totals);
    console.log("Order saved:", order.id);
  } catch (error) {
    console.error("Failed to save order:", error);
  }

  // Clear cart
  cart = [];
  saveCart();
  updateCartCount();

  // Re-render if on cart page
  if (typeof renderCart === "function") {
    renderCart();
  }

  // Show success
  showNotification(
    "Order placed successfully! 🎉 Thank you for shopping!",
    "success",
  );
  // Redirect to homepage after short delay
  window.location.replace("index.html");
}

// Helper function to calculate totals
function calculateTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// Notification
function showNotification(message) {
  const notif = document.createElement("div");
  notif.className =
    "fixed bottom-4 right-4 bg-dark text-white px-6 py-3 rounded-xl shadow-lg z-50 fade-in flex items-center gap-2";
  notif.innerHTML = `<span>✓</span> ${message}`;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 3000);
}
