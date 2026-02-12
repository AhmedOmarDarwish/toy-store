let currentProduct = null;
let currentQuantity = 1;

document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();

  initTheme();
  loadProductDetails();
  updateCartCount();
  checkAuthStatus();
});

function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  currentProduct = products.find((p) => p.id === productId);

  if (!currentProduct) {
    window.location.href = "products.html";
    return;
  }

  // Update page
  document.title = `${currentProduct.name} - ToyLand`;
  document.getElementById("breadcrumbName").textContent = currentProduct.name;
  document.getElementById("mainImage").src = currentProduct.image[0];
  document.getElementById("mainImage").alt = currentProduct.name;
  document.getElementById("productName").textContent = currentProduct.name;
  document.getElementById("productDescription").textContent =
    currentProduct.description;
  document.getElementById("productPrice").textContent =
    `$${currentProduct.price.toFixed(2)}`;

  // Rating
  const stars =
    "★".repeat(Math.floor(currentProduct.rating)) +
    "☆".repeat(5 - Math.floor(currentProduct.rating));
  document.getElementById("productRating").textContent = stars;
  document.getElementById("reviewCount").textContent =
    `(${currentProduct.reviews} reviews)`;

  // Badges
  const badgesContainer = document.getElementById("productBadges");
  if (currentProduct.isNew) {
    badgesContainer.innerHTML += `<span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold">NEW</span>`;
  }
  if (currentProduct.discount) {
    badgesContainer.innerHTML += `<span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">-${currentProduct.discount}%</span>`;
    document.getElementById("originalPrice").textContent =
      `$${(currentProduct.price / (1 - currentProduct.discount / 100)).toFixed(2)}`;
    document.getElementById("originalPrice").classList.remove("hidden");
  }

  // Thumbnails (simulated)
  const thumbContainer = document.getElementById("thumbnailContainer");
  for (let i = 0; i < currentProduct.image.length; i++) {
    thumbContainer.innerHTML += `
                    <img src="${currentProduct.image[i]}" onclick="changeMainImage('${currentProduct.image[i]}')" 
                         class="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-primary transition ${i === 0 ? "border-primary" : ""}">
                `;
  }

  // Load related products
  loadRelatedProducts(currentProduct.category, currentProduct.id);
}

function changeMainImage(src) {
  document.getElementById("mainImage").src = src;
}

function updateQuantity(change) {
  const input = document.getElementById("quantityInput");
  let newVal = parseInt(input.value) + change;
  if (newVal >= 1 && newVal <= 10) {
    input.value = newVal;
    currentQuantity = newVal;
  }
}

function addToCartFromDetails() {
  // if (!currentUser) {
  //   window.location.href =
  //     "login.html?redirect=" + encodeURIComponent(window.location.href);
  //   return;
  // }
  addToCart(currentProduct.id, currentQuantity);
}

function loadRelatedProducts(category, excludeId) {
  const related = products
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, 4);
  const container = document.getElementById("relatedProducts");

  related.forEach((product) => {
    container.innerHTML += createProductCard(product);
  });
}
