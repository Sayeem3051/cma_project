// Cart page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    loadCartItems();
    
    // Load saved items
    loadSavedItems();
    
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

// Function to load cart items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (!cartItemsContainer) return;
    
    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Show or hide empty cart message
    if (cartItems.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        
        // Update subtotal text
        updateSubtotal(0, 0);
        return;
    } else {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
    }
    
    // Clear existing cart items (except the empty message)
    Array.from(cartItemsContainer.children).forEach(child => {
        if (!child.classList.contains('empty-cart-message')) {
            child.remove();
        }
    });
    
    // Calculate total quantity and price
    let totalQuantity = 0;
    let totalPrice = 0;
    
    // Create cart item elements
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
        
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    
    // Update subtotal text
    updateSubtotal(totalQuantity, totalPrice);
}

// Function to create a cart item element
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-stock">In Stock</div>
            <div class="cart-item-seller">Sold by: Amazon.com</div>
            <div class="cart-item-controls">
                <select class="item-quantity" data-id="${item.id}">
                    ${generateQuantityOptions(item.quantity)}
                </select>
                <div class="cart-item-actions">
                    <a href="#" class="delete-item" data-id="${item.id}">Delete</a>
                    <a href="#" class="save-for-later-item" data-id="${item.id}">Save for later</a>
                </div>
            </div>
        </div>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    
    // Add event listeners
    const quantitySelect = cartItem.querySelector('.item-quantity');
    const deleteLink = cartItem.querySelector('.delete-item');
    const saveForLaterLink = cartItem.querySelector('.save-for-later-item');
    
    quantitySelect.addEventListener('change', function() {
        updateItemQuantity(item.id, parseInt(this.value));
    });
    
    deleteLink.addEventListener('click', function(e) {
        e.preventDefault();
        removeItemFromCart(item.id);
    });
    
    saveForLaterLink.addEventListener('click', function(e) {
        e.preventDefault();
        moveItemToSavedForLater(item.id);
    });
    
    return cartItem;
}

// Function to generate quantity options for select dropdown
function generateQuantityOptions(selectedQuantity) {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}" ${i === selectedQuantity ? 'selected' : ''}>Qty: ${i}</option>`;
    }
    return options;
}

// Function to update item quantity
function updateItemQuantity(itemId, newQuantity) {
    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Find the item
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cartItems[itemIndex].quantity = newQuantity;
        
        // Save back to localStorage
        localStorage.setItem('amazonCart', JSON.stringify(cartItems));
        
        // Reload cart items
        loadCartItems();
    }
}

// Function to remove item from cart
function removeItemFromCart(itemId) {
    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Filter out the item to remove
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Save back to localStorage
    localStorage.setItem('amazonCart', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
    
    // Reload cart items
    loadCartItems();
}

// Function to move item from cart to saved for later
function moveItemToSavedForLater(itemId) {
    // Get cart and saved items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('amazonCart')) || [];
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Find the item in cart
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Get the item
        const item = cartItems[itemIndex];
        
        // Check if already in saved items
        const existsInSaved = savedItems.some(savedItem => savedItem.id === item.id);
        
        if (!existsInSaved) {
            // Add to saved items
            savedItems.push(item);
            
            // Remove from cart
            cartItems.splice(itemIndex, 1);
            
            // Save back to localStorage
            localStorage.setItem('amazonCart', JSON.stringify(cartItems));
            localStorage.setItem('amazonSaved', JSON.stringify(savedItems));
            
            // Update cart count
            updateCartCount();
            
            // Reload cart and saved items
            loadCartItems();
            loadSavedItems();
        }
    }
}

// Function to update subtotal text
function updateSubtotal(quantity, total) {
    const cartSubtotalText = document.getElementById('cart-subtotal-text');
    const cartSubtotalAmount = document.getElementById('cart-subtotal-amount');
    const checkoutSubtotalText = document.getElementById('checkout-subtotal-text');
    const checkoutSubtotalAmount = document.getElementById('checkout-subtotal-amount');
    
    const subtotalText = `Subtotal (${quantity} ${quantity === 1 ? 'item' : 'items'}): `;
    const subtotalAmount = `$${total.toFixed(2)}`;
    
    if (cartSubtotalText) cartSubtotalText.textContent = subtotalText;
    if (cartSubtotalAmount) cartSubtotalAmount.textContent = subtotalAmount;
    if (checkoutSubtotalText) checkoutSubtotalText.textContent = subtotalText;
    if (checkoutSubtotalAmount) checkoutSubtotalAmount.textContent = subtotalAmount;
}

// Function to load saved items
function loadSavedItems() {
    const savedItemsContainer = document.getElementById('saved-items');
    const noSavedItemsMessage = document.getElementById('no-saved-items');
    
    if (!savedItemsContainer) return;
    
    // Get saved items from localStorage
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Show or hide no saved items message
    if (savedItems.length === 0) {
        if (noSavedItemsMessage) {
            noSavedItemsMessage.style.display = 'block';
        }
        return;
    } else {
        if (noSavedItemsMessage) {
            noSavedItemsMessage.style.display = 'none';
        }
    }
    
    // Clear existing saved items (except the no items message)
    Array.from(savedItemsContainer.children).forEach(child => {
        if (!child.classList.contains('no-saved-items')) {
            child.remove();
        }
    });
    
    // Create saved item elements
    savedItems.forEach(item => {
        const savedItemElement = createSavedItemElement(item);
        savedItemsContainer.appendChild(savedItemElement);
    });
}

// Function to create a saved item element
function createSavedItemElement(item) {
    const savedItem = document.createElement('div');
    savedItem.className = 'saved-item';
    savedItem.dataset.id = item.id;
    
    savedItem.innerHTML = `
        <div class="saved-item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="saved-item-details">
            <div class="saved-item-title">${item.title}</div>
            <div class="saved-item-price">$${item.price.toFixed(2)}</div>
            <button class="move-to-cart-btn" data-id="${item.id}">Move to Cart</button>
        </div>
    `;
    
    // Add event listener for move to cart button
    const moveToCartBtn = savedItem.querySelector('.move-to-cart-btn');
    
    moveToCartBtn.addEventListener('click', function() {
        moveItemToCart(item.id);
    });
    
    return savedItem;
}

// Function to move item from saved for later to cart
function moveItemToCart(itemId) {
    // Get cart and saved items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('amazonCart')) || [];
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Find the item in saved items
    const itemIndex = savedItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Get the item
        const item = savedItems[itemIndex];
        
        // Set quantity to 1 (or previous quantity if it exists)
        if (!item.quantity) {
            item.quantity = 1;
        }
        
        // Check if already in cart
        const existingCartItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingCartItemIndex !== -1) {
            // If the item exists in cart, increment quantity
            cartItems[existingCartItemIndex].quantity += item.quantity;
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
        
        // Reload cart and saved items
        loadCartItems();
        loadSavedItems();
    }
} 