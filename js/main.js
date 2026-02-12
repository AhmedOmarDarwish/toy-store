// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  initTheme();
  initMobileMenu();
  initSwiper();
  loadFeaturedProducts();
  updateCartCount();
  checkAuthStatus();
  initNewsletter();
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

// Swiper Sliders
function initSwiper() {
  // Brands Slider
  if (document.querySelector(".brandsSwiper")) {
    new Swiper(".brandsSwiper", {
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      },
    });
  }

  // Testimonials Slider
  if (document.querySelector(".testimonialSwiper")) {
    new Swiper(".testimonialSwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
}

// Newsletter Form
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      alert(`Thanks for subscribing! 🎉 We've sent a confirmation to ${email}`);
      form.reset();
    });
  }
}
