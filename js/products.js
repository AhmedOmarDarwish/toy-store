// Product Database
let products = [];

// Initialize products page
document.addEventListener("DOMContentLoaded", async () => {

    const searchInput = document.getElementById("searchInput");
    const categoryInput = document.getElementById("categoryFilter");
    const sortInput = document.getElementById("sortFilter");

    if (!searchInput || !categoryInput || !sortInput) return;
    
  await loadProducts();
  initProductsPage();
  initTheme();
  updateCartCount();
  checkAuthStatus();
  initMobileMenu(); 
});

// Mobile Menu
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
}




//load products from JSON
async function loadProducts() {
  try {
    const res = await fetch("/data/products.json");
    if (!res.ok) throw new Error("Failed to load products.json");

    products = await res.json();
  } catch (err) {
    console.error(err);
  }
}

// Create Product Card HTML
function createProductCard(product) {
  const discountPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;
  const stars =
    "★".repeat(Math.floor(product.rating)) +
    "☆".repeat(5 - Math.floor(product.rating));

  return `
        <div class="product-card bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group fade-in">
            <div class="relative overflow-hidden">
                <img src="${product.image[0]}" alt="${product.name}" class="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500">
                ${product.discount ? `<span class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-${product.discount}%</span>` : ""}
                ${product.isNew ? `<span class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">NEW</span>` : ""}
                <button onclick="addToCart(${product.id})" class="absolute bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-16 group-hover:translate-y-0 transition duration-300 hover:bg-red-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <div class="flex text-yellow-400 text-sm mb-2">${stars} <span class="text-gray-400 ml-2">(${product.reviews})</span></div>
                <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2">${product.name}</h3>
                <div class="flex items-center justify-between">
                    <div>
                        ${
                          discountPrice
                            ? `<span class="text-2xl font-bold text-primary">$${discountPrice}</span>
                             <span class="text-sm text-gray-400 line-through ml-2">$${product.price.toFixed(2)}</span>`
                            : `<span class="text-2xl font-bold text-primary">$${product.price.toFixed(2)}</span>`
                        }
                    </div>
                    <a href="product-details.html?id=${product.id}" class="text-sm text-gray-500 hover:text-primary transition">View Details→</a>
                </div>
            </div>
        </div>
    `;
}

// Initialize Products Page
function initProductsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");

  if (categoryParam) {
    document.getElementById("categoryFilter").value = categoryParam;
  }

  filterProducts();

  // Event listeners
  document
    .getElementById("searchInput")
    .addEventListener("input", debounce(filterProducts, 300));
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("sortFilter")
    .addEventListener("change", filterProducts);
}

// Filter and Sort Products
function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const categoryInput = document.getElementById("categoryFilter");
  const sortInput = document.getElementById("sortFilter");

  if (!searchInput || !categoryInput || !sortInput) return;
  const search = searchInput.value.toLowerCase();
  const category = categoryInput.value;
  const sort = sortInput.value;

  let filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort
  if (sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Render
  const container = document.getElementById("productsGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");

  container.innerHTML = "";
  resultsCount.textContent = filtered.length;

  if (filtered.length === 0) {
    container.classList.add("hidden");
    emptyState.classList.remove("hidden");
  } else {
    container.classList.remove("hidden");
    emptyState.classList.add("hidden");
    filtered.forEach((product) => {
      container.innerHTML += createProductCard(product);
    });
  }
}

// Reset Filters
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "all";
  document.getElementById("sortFilter").value = "default";
  filterProducts();
}

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Load Featured Products on Home
function loadFeaturedProducts() {
  const featured = products.slice(0, 4);
  const container = document.getElementById("featuredProducts");
  if (container) {
    container.innerHTML = featured.map((p) => createProductCard(p)).join("");
  }
}
