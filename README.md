toy-store/
├── index.html              # Home page
├── products.html           # Product listing
├── product-details.html    # Single product
├── cart.html              # Shopping cart
├── login.html             # Login page
├── register.html          # Registration
├── profile.html           # User profile
├── js/
│   ├── main.js           # Main app logic, theme, mobile menu
│   ├── products.js       # Product data and functions
│   ├── cart.js           # Cart functionality
│   └── auth.js           # Authentication system
└── README.md

# ToyLand - E-Commerce Toy Store

A complete, responsive e-commerce website for a toy store built with HTML5, TailwindCSS, and Vanilla JavaScript.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Dark/Light Mode**: Toggle between themes with preference saved to localStorage
- **Product Management**: Browse, filter, sort, and search products
- **Shopping Cart**: Add, remove, update quantities with localStorage persistence
- **User Authentication**: Login/Register with localStorage (demo credentials provided)
- **Protected Routes**: Cart page requires login
- **Interactive UI**: Swiper sliders, animations, hover effects

## Pages

1. **Home** (`index.html`) - Hero, categories, featured products, testimonials, newsletter
2. **Products** (`products.html`) - Product grid with filters and sorting
3. **Product Details** (`product-details.html`) - Single product view with gallery
4. **Cart** (`cart.html`) - Shopping cart with checkout (protected)
5. **Login** (`login.html`) - User authentication
6. **Register** (`register.html`) - Account creation
7. **Profile** (`profile.html`) - User dashboard (protected)

## Quick Start

1. **Clone or download** the project files
2. **No build step required** - TailwindCSS is loaded via CDN
3. **Open `index.html`** in any modern web browser
4. **For local development**, use a local server (recommended):
