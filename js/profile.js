// document.addEventListener("DOMContentLoaded", () => {
//     initTheme();
//   checkAuthStatus();
//   if (!currentUser) {
//     window.location.href = "login.html?redirect=profile.html";
//     return;
//   }
//   loadProfileData();
//   updateCartCount();
// });

// function loadProfileData() {
//   document.getElementById("profileName").textContent = currentUser.name;
//   document.getElementById("profileEmail").textContent = currentUser.email;
//   document.getElementById("profileAvatar").textContent = currentUser.name
//     .charAt(0)
//     .toUpperCase();
//   document.getElementById("joinDate").textContent = new Date(
//     currentUser.joinDate,
//   ).toLocaleDateString();

//   // Load cart count for orders simulation
//   const cart = JSON.parse(localStorage.getItem("toyland_cart")) || [];
//   document.getElementById("orderCount").textContent =
//     cart.length > 0 ? Math.floor(Math.random() * 5) + 1 : 0;
// }

//---------------------------

// Load profile data
document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();
  loadOrderStats();
  updateCartCount();
  initTheme();
});

const OrderManager = {
  STORAGE_KEY_ORDERS: "toyland_orders",

  // Save completed order
  saveOrder(cartItems, totals) {
    const orders =
      JSON.parse(localStorage.getItem(this.STORAGE_KEY_ORDERS)) || [];

    const newOrder = {
      id: "ORD_" + Date.now(),
      userId: currentUser.id,
      date: new Date().toISOString(),
      items: [...cartItems],
      totals: { ...totals },
      status: "completed",
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };

    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(orders));

    return newOrder;
  },

  // Get all orders
  getCurrentUserOrders() {
    try {
      return (
        JSON.parse(localStorage.getItem(this.STORAGE_KEY_ORDERS)).filter(
          (order) => order.userId === currentUser.id,
        ) || []
      );
    } catch {
      return [];
    }
  },

  // Get order statistics
  getOrderStats() {
    const orders = this.getCurrentUserOrders();

    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalItems: 0,
        totalSpent: 0,
        averageOrder: 0,
        lastOrder: null,
      };
    }

    const totalItems = orders.reduce((sum, order) => sum + order.itemCount, 0);
    const totalSpent = orders.reduce(
      (sum, order) => sum + order.totals.total,
      0,
    );

    return {
      totalOrders: orders.length,
      totalItems: totalItems,
      totalSpent: totalSpent,
      averageOrder: totalSpent / orders.length,
      lastOrder: orders[0],
    };
  },

  // Clear order history
  clearOrders() {
    const orders =
      JSON.parse(localStorage.getItem(this.STORAGE_KEY_ORDERS)) || [];

    const remainingOrders = orders.filter(
      (order) => order.userId !== currentUser.id,
    );

    localStorage.setItem(
      this.STORAGE_KEY_ORDERS,
      JSON.stringify(remainingOrders),
    );
  },
};

function loadProfileData() {
  checkAuthStatus();
  if (!currentUser) return;
  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("profileEmail").textContent = currentUser.email;
  document.getElementById("userAvatar").textContent =
    currentUser && currentUser.name
      ? currentUser.name.charAt(0) === " "
        ? currentUser.name.charAt(1).toUpperCase()
        : currentUser.name.charAt(0).toUpperCase()
      : "U";



  document.getElementById("joinDate").textContent = new Date(
    currentUser.joinDate,
  ).toLocaleDateString();

  // Set member badge based on orders
  const stats = OrderManager.getOrderStats();
  const badge = document.getElementById("memberBadge");
  if (stats.totalSpent > 500) {
    badge.textContent = "🥇 Gold Member";
    badge.className =
      "inline-block mt-2 px-3 py-1 bg-yellow-400/30 rounded-full text-sm text-yellow-900 dark:text-yellow-100";
  } else if (stats.totalSpent > 200) {
    badge.textContent = "🥈 Silver Member";
    badge.className =
      "inline-block mt-2 px-3 py-1 bg-gray-400/30 rounded-full text-sm text-gray-900 dark:text-gray-100";
  }
}

function loadOrderStats() {
  const stats = OrderManager.getOrderStats();
  const orders = OrderManager.getCurrentUserOrders();

  // Update statistics
  document.getElementById("totalOrders").textContent = stats.totalOrders;
  document.getElementById("totalItems").textContent = stats.totalItems;
  document.getElementById("totalSpent").textContent =
    "$" + stats.totalSpent.toFixed(2);
  document.getElementById("avgOrder").textContent =
    "$" + stats.averageOrder.toFixed(2);

  // Show/hide no orders message
  const noOrders = document.getElementById("noOrders");
  const ordersList = document.getElementById("ordersList");

  if (orders.length === 0) {
    noOrders.classList.remove("hidden");
    return;
  }

  noOrders.classList.add("hidden");

  // Render recent orders (last 5)
  orders.slice(0, 5).forEach((order) => {
    const orderDate = new Date(order.date).toLocaleDateString();
    const itemCount =
      order.itemCount || order.items.reduce((a, b) => a + b.quantity, 0);

    const orderEl = document.createElement("div");
    orderEl.className =
      "order-row p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition";
    orderEl.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                            📦
                        </div>
                        <div>
                            <p class="font-bold text-gray-800 dark:text-white">Order ${order.id.split("_")[1].slice(-6)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${orderDate} • ${itemCount} items</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-primary text-lg">$${(order.totals?.total || 0).toFixed(2)}</p>
                        <span class="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Completed</span>
                    </div>
                `;

    ordersList.appendChild(orderEl);
  });
}

function clearOrderHistory() {
  if (OrderManager.getCurrentUserOrders().length === 0) {
    showNotification("No orders to clear!", "error");
    return;
  } else {
    if (confirm("Clear all order history? This cannot be undone.")) {
      OrderManager.clearOrders();
      location.reload();
    }
  }
}

function logout() {
  localStorage.removeItem("toyland_user");
  sessionStorage.removeItem("toyland_user");
  currentUser = null;
  window.location.replace("index.html");
}
