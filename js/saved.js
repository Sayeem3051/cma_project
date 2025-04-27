// Saved items page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load saved items from localStorage
    loadSavedItems();
    
    // Load recommended products
    loadRecommendedProducts();
    
    // Update cart count
    updateCartCount();
    
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

// Function to load saved items
function loadSavedItems() {
    const savedItemsContainer = document.getElementById('saved-items-list');
    const emptySavedMessage = document.getElementById('empty-saved-message');
    
    if (!savedItemsContainer) return;
    
    // Get saved items from localStorage
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Show or hide empty saved message
    if (savedItems.length === 0) {
        if (emptySavedMessage) {
            emptySavedMessage.style.display = 'block';
        }
        return;
    } else {
        if (emptySavedMessage) {
            emptySavedMessage.style.display = 'none';
        }
    }
    
    // Clear existing saved items (except the empty message)
    Array.from(savedItemsContainer.children).forEach(child => {
        if (!child.classList.contains('empty-saved-message')) {
            child.remove();
        }
    });
    
    // Create saved item rows
    savedItems.forEach(item => {
        const savedItemRow = createSavedItemRow(item);
        savedItemsContainer.appendChild(savedItemRow);
    });
}

// Function to create a saved item row
function createSavedItemRow(item) {
    const savedItemRow = document.createElement('div');
    savedItemRow.className = 'saved-item-row';
    savedItemRow.dataset.id = item.id;
    
    savedItemRow.innerHTML = `
        <div class="saved-item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="saved-item-details">
            <div class="saved-item-title">${item.title}</div>
            <div class="saved-item-price">$${item.price.toFixed(2)}</div>
            <div class="saved-item-stock">In Stock</div>
            <div class="saved-item-seller">Sold by: Amazon.com</div>
            <div class="saved-item-buttons">
                <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = savedItemRow.querySelector('.add-to-cart-btn');
    const deleteBtn = savedItemRow.querySelector('.delete-btn');
    
    addToCartBtn.addEventListener('click', function() {
        moveItemToCart(item.id);
    });
    
    deleteBtn.addEventListener('click', function() {
        removeFromSaved(item.id);
    });
    
    return savedItemRow;
}

// Function to move item from saved to cart
function moveItemToCart(itemId) {
    // Get cart and saved items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('amazonCart')) || [];
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Find the item in saved items
    const itemIndex = savedItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Get the item
        const item = savedItems[itemIndex];
        
        // Set quantity to 1
        item.quantity = 1;
        
        // Check if already in cart
        const existingCartItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingCartItemIndex !== -1) {
            // If the item exists in cart, increment quantity
            cartItems[existingCartItemIndex].quantity += 1;
        } else {
            // Otherwise add to cart
            cartItems.push(item);
        }
        
        // Remove from saved items
        savedItems.splice(itemIndex, 1);
        
        // Save back to localStorage
        localStorage.setItem('amazonCart', JSON.stringify(cartItems));
        localStorage.setItem('amazonSaved', JSON.stringify(savedItems));
        
        // Update cart count
        updateCartCount();
        
        // Reload saved items
        loadSavedItems();
        
        // Show confirmation
        alert('Item added to your cart!');
    }
}

// Function to remove item from saved
function removeFromSaved(itemId) {
    // Get saved items from localStorage
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Filter out the item to remove
    savedItems = savedItems.filter(item => item.id !== itemId);
    
    // Save back to localStorage
    localStorage.setItem('amazonSaved', JSON.stringify(savedItems));
    
    // Reload saved items
    loadSavedItems();
}

// Function to load recommended products
function loadRecommendedProducts() {
    const recommendedContainer = document.getElementById('recommended-products');
    if (!recommendedContainer) return;
    
    // Clear existing products
    recommendedContainer.innerHTML = '';
    
    // Get sample product data
    let recommendations = getSampleRecommendations();
    
    // Create recommendation elements
    recommendations.forEach(product => {
        const recommendedProduct = createRecommendedProduct(product);
        recommendedContainer.appendChild(recommendedProduct);
    });
}

// Function to create a recommended product
function createRecommendedProduct(product) {
    const recommendedProduct = document.createElement('div');
    recommendedProduct.className = 'recommended-product';
    
    // Create the rating stars HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= product.rating) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        } else {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }
    }
    
    recommendedProduct.innerHTML = `
        <div class="recommended-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="recommended-title">${product.title}</div>
        <div class="recommended-rating">
            ${starsHtml}
            <span class="recommended-count">(${product.ratingCount})</span>
        </div>
        <div class="recommended-price">$${product.price.toFixed(2)}</div>
        <button class="view-product-btn" data-id="${product.id}">View Product</button>
    `;
    
    // Add event listener
    const viewProductBtn = recommendedProduct.querySelector('.view-product-btn');
    
    viewProductBtn.addEventListener('click', function() {
        // In a real app, this would navigate to the product page
        // For this demo, navigate to products page
        window.location.href = 'products.html';
    });
    
    return recommendedProduct;
}

// Sample recommendation data
function getSampleRecommendations() {
    return [
        {
            id: 101,
            title: "Wireless Bluetooth Earbuds with Charging Case",
            price: 34.99,
            image: "https://m.media-amazon.com/images/I/61jVIRmJJJL._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 4587
        },
        {
            id: 102,
            title: "Smart Watch Fitness Tracker with Heart Rate Monitor",
            price: 45.99,
            image: "https://m.media-amazon.com/images/I/61GVQzn8B+L._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 2365
        },
        {
            id: 103,
            title: "Portable Bluetooth Speaker Waterproof with 24-Hour Playtime",
            price: 29.99,
            image: "https://m.media-amazon.com/images/I/71T4+X2OvJL._AC_UL320_.jpg",
            rating: 5,
            ratingCount: 7645
        },
        {
            id: 104,
            title: "Wireless Charging Pad for iPhone and Android",
            price: 16.99,
            image: "https://m.media-amazon.com/images/I/61CL+gWNQ5L._AC_UL320_.jpg",
            rating: 4,
            ratingCount: 3912
        }
    ];
} 