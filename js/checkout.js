// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display cart items on page load
document.addEventListener('DOMContentLoaded', function() {
    renderCartItems();
    setupEventListeners();
});

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderSummary = document.getElementById('order-summary');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        orderSummary.classList.add('hidden');
        checkoutForm.classList.add('hidden');
        return;
    }

    emptyCartMessage.classList.add('hidden');
    orderSummary.classList.remove('hidden');
    checkoutForm.classList.remove('hidden');

    // Render each cart item
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center justify-between py-4 border-b border-gray-200 transition-all duration-300';
        itemElement.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image || './images/logo.png'}" alt="${item.name}" class="w-16 h-16 object-contain rounded">
                <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">${item.name}</h3>
                    ${item.isPackage ? '<span class="text-xs text-blue-500">Cleaning Package</span>' : ''}
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center">
                <div class="flex items-center border border-gray-300 rounded">
                    <button class="decrement-btn px-3 py-1 text-gray-600 hover:bg-gray-100" data-index="${index}">-</button>
                    <span class="quantity px-3" data-index="${index}">${item.quantity}</span>
                    <button class="increment-btn px-3 py-1 text-gray-600 hover:bg-gray-100" data-index="${index}">+</button>
                </div>
                <button class="remove-btn ml-6 text-red-500 hover:text-red-700" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    updateTotals();
}

function setupEventListeners() {
    // Use event delegation for all cart buttons
    document.addEventListener('click', function(e) {
        const index = e.target.closest('[data-index]')?.getAttribute('data-index');
        if (index === null || index === undefined) return;

        if (e.target.classList.contains('increment-btn') || e.target.closest('.increment-btn')) {
            cart[index].quantity++;
            updateCart();
        }
        else if (e.target.classList.contains('decrement-btn') || e.target.closest('.decrement-btn')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart();
            }
        }
        else if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            removeItem(index);
        }
    });

    // Form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', submitOrder);
    }

    // Modal close
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    showToast('Cart updated');
}

function removeItem(index) {
    const itemElement = document.querySelector(`[data-index="${index}"]`)?.closest('div.flex');
    if (itemElement) {
        itemElement.classList.add('opacity-0', 'translate-x-4');
        
        setTimeout(() => {
            cart.splice(index, 1);
            updateCart();
            showToast('Item removed from cart');
        }, 300);
    }
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function submitOrder(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        payment: document.querySelector('input[name="payment"]:checked')?.value,
        cart: cart,
        total: document.getElementById('total').textContent
    };

    // Show confirmation modal
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.querySelector('div').classList.remove('scale-95');
    }
    
    // In a real app, send data to backend here
    console.log('Order submitted:', formData);

    // Clear cart
    localStorage.removeItem('cart');
    cart = [];

    // Redirect to home page after delay
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.querySelector('div').classList.add('scale-95');
        modal.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 300);
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-teal-600 text-white px-4 py-2 rounded shadow-lg animate-fadeIn';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}



// Initialize EmailJS
(function() {
    emailjs.init('ojLsDsUFEr7AvxogL');
  })();
  
  // Update the SendMail function
function SendMail(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('button');
    const form = document.getElementById('checkout-form');
  
    // Format cart items for email
    const orderList = cart.map(item => 
      `${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
  
    const totalAmount = document.getElementById('total').textContent;
  
    // Prepare email data with order details
    const templateParams = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value || 'Not provided',
      address: document.getElementById('address').value,
      order_list: orderList,
      total: totalAmount,
      date: new Date().toLocaleString()
    };
  
    // Send email
    emailjs.send('service_zxwz8zk', 'template_ffrehav', templateParams)
  .then(() => {
    // Show confirmation modal
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('div').classList.remove('scale-95');
    
    // Clear cart
    localStorage.removeItem('cart');
    cart = [];
    
    // Reset form
    form.reset();
    
    // Redirect to home page after delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  })
  .catch(error => {
    console.error('Email send failed:', error);
    // Optional: Show error in modal or other UI element instead of alert
    const modal = document.getElementById('confirmation-modal');
    modal.querySelector('h3').textContent = "Order Failed!";
    modal.querySelector('p').textContent = "Failed to send confirmation. Please try again.";
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('div').classList.remove('scale-95');
  });

}