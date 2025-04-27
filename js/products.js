// Products page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count from localStorage
    updateCartCount();
    
    // Load product data
    loadProducts();
    
    // Handle sorting change
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            loadProducts(this.value);
        });
    }
    
    // Handle filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            loadProducts();
        });
    });
    
    // Back to top functionality
    const backToTopButton = document.querySelector('.footer-panel1');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Function to update cart count in the header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-number');
    if (!cartCount) return;
    
    // Get cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Update the cart count display
    cartCount.textContent = cart.length;
}

// Function to load products
function loadProducts(sortOption = 'Sort by: Featured') {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // In a real application, this would fetch products from a server
    // For this demo, we'll use sample product data
    let products = getSampleProducts();
    
    // Apply sorting
    products = sortProducts(products, sortOption);
    
    // Apply filters
    products = filterProducts(products);
    
    // Generate product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Function to create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Create the rating stars HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= product.rating) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        } else {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-title">${product.title}</div>
        <div class="product-rating">
            ${starsHtml}
            <span class="rating-count">(${product.ratingCount})</span>
        </div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-prime">
            ${product.isPrime ? '<i class="fa-solid fa-check"></i> Prime FREE Delivery' : 'FREE Delivery'}
        </div>
        <div class="product-buttons">
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="save-for-later" data-id="${product.id}">Save for Later</button>
        </div>
    `;
    
    // Add event listeners for buttons
    const addToCartBtn = card.querySelector('.add-to-cart');
    const saveForLaterBtn = card.querySelector('.save-for-later');
    
    addToCartBtn.addEventListener('click', function() {
        addProductToCart(product);
    });
    
    saveForLaterBtn.addEventListener('click', function() {
        saveProductForLater(product);
    });
    
    return card;
}

// Function to add a product to cart
function addProductToCart(product) {
    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // If the product exists, increment the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Otherwise, add it with quantity 1
        product.quantity = 1;
        cart.push(product);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('amazonCart', JSON.stringify(cart));
    
    // Update the cart count in the header
    updateCartCount();
    
    // Show a confirmation message
    alert('Item added to your cart!');
}

// Function to save a product for later
function saveProductForLater(product) {
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Check if product already exists in saved items
    const existingProductIndex = savedItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex === -1) {
        // Only add if it doesn't already exist
        savedItems.push(product);
    }
    
    // Save updated saved items to localStorage
    localStorage.setItem('amazonSaved', JSON.stringify(savedItems));
    
    // Show a confirmation message
    alert('Item saved for later!');
}

// Function to sort products based on the selected option
function sortProducts(products, sortOption) {
    switch(sortOption) {
        case 'Price: Low to High':
            return products.sort((a, b) => a.price - b.price);
        case 'Price: High to Low':
            return products.sort((a, b) => b.price - a.price);
        case 'Customer Review':
            return products.sort((a, b) => b.rating - a.rating);
        case 'Newest Arrivals':
            return products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        default: // Featured
            return products;
    }
}

// Function to filter products based on selected filters
function filterProducts(products) {
    // Get checked department filters
    const departmentFilters = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(checkbox => checkbox.id);
    
    // If no filters are selected, return all products
    if (departmentFilters.length === 0) {
        return products;
    }
    
    // Filter products by department
    return products.filter(product => {
        return departmentFilters.some(filter => product.categories.includes(filter));
    });
}

// Sample product data for demonstration
function getSampleProducts() {
    return [
        {
            id: 1,
            title: "New Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD)",
            price: 1299.99,
            image: "https://m.media-amazon.com/images/I/71an9eiBxpL._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 1423,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-01-15"
        },
        {
            id: 2,
            title: "Apple AirPods Pro Wireless Earbuds with MagSafe Charging Case",
            price: 249.99,
            image: "https://m.media-amazon.com/images/I/71zny7BTRlL._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 5297,
            isPrime: true,
            categories: ["electronics"],
            dateAdded: "2023-02-20"
        },
        {
            id: 3,
            title: "Samsung Galaxy S21 Ultra 5G Factory Unlocked Android Cell Phone 128GB",
            price: 999.99,
            image: "https://m.media-amazon.com/images/I/61O45C5qASL._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 3521,
            isPrime: true,
            categories: ["electronics", "smartphone"],
            dateAdded: "2023-03-05"
        },
        {
            id: 4,
            title: "Sony X80J 65 Inch TV: 4K Ultra HD LED Smart Google TV",
            price: 799.99,
            image: "https://m.media-amazon.com/images/I/91RfzivKmwL._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 1892,
            isPrime: true,
            categories: ["electronics", "tv"],
            dateAdded: "2023-04-10"
        },
        {
            id: 5,
            title: "Canon EOS R6 Full-Frame Mirrorless Camera with 24-105mm Lens Kit",
            price: 2499.99,
            image: "https://m.media-amazon.com/images/I/61SAg1N6YHL._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 487,
            isPrime: true,
            categories: ["electronics", "camera"],
            dateAdded: "2023-05-15"
        },
        {
            id: 6,
            title: "Amazon Echo (4th Gen) | With premium sound, smart home hub, and Alexa",
            price: 99.99,
            image: "https://m.media-amazon.com/images/I/71JB6hM6Z6L._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 12568,
            isPrime: true,
            categories: ["electronics"],
            dateAdded: "2023-06-20"
        },
        {
            id: 7,
            title: "Acer Aspire 5 A515-56-36UT Slim Laptop | 15.6\" Full HD Display",
            price: 389.99,
            image: "https://m.media-amazon.com/images/I/7189iXimfWL._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 1936,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-07-25"
        },
        {
            id: 8,
            title: "Logitech MX Master 3 Advanced Wireless Mouse",
            price: 99.99,
            image: "https://m.media-amazon.com/images/I/614w3LuZTYL._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 8765,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-08-30"
        },
        {
            id: 9,
            title: "Samsung 970 EVO Plus SSD 2TB NVMe M.2 Internal Solid State Hard Drive",
            price: 199.99,
            image: "https://m.media-amazon.com/images/I/81gqFEXJItL._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 6543,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-09-05"
        },
        {
            id: 10,
            title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones",
            price: 348.00,
            image: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 32651,
            isPrime: true,
            categories: ["electronics"],
            dateAdded: "2023-10-10"
        },
        {
            id: 11,
            title: "Google Pixel 6 Pro - 5G Android Phone - 128GB",
            price: 899.00,
            image: "https://m.media-amazon.com/images/I/71SGl7xwR4L._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 2134,
            isPrime: true,
            categories: ["electronics", "smartphone"],
            dateAdded: "2023-11-15"
        },
        {
            id: 12,
            title: "LG 27GP850-B 27\" Ultragear QHD Nano IPS 1ms 165Hz HDR Monitor",
            price: 396.99,
            image: "https://m.media-amazon.com/images/I/81dAe2wXIqL._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 1876,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-12-20"
        }
    ];
} 