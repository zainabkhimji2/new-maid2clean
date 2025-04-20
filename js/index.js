// Initialize Swiper
function initSwiper() {
  if (document.querySelector('.swiper')) {
    const swiper = new Swiper('.swiper', {
      loop: true,
      autoplay: { 
        delay: 6000, 
        disableOnInteraction: false 
      },
      effect: 'fade',
      fadeEffect: { 
        crossFade: true 
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function(index, className) {
          return `<span class="${className} bg-white w-3 h-3 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"></span>`;
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}

// Navbar Scroll Effect
function setupNavbarScroll() {
  window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      const svg = menuToggle.querySelector('svg');
      if (svg) {
        svg.classList.toggle('rotate-90');
      }
    });
  }
}


// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update the updateCartCount function to handle both cases
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('#cartCount');
  const count = cart.reduce(function(sum, item) {
    return sum + (item.quantity || 0);
  }, 0);
  
  cartCountElements.forEach(element => {
    element.textContent = count;
    element.classList.toggle('scale-125', count > 0);
    if (count > 0) {
      element.classList.add('animate-bounce');
      setTimeout(function() {
        element.classList.remove('animate-bounce');
      }, 500);
    }
  });
}
const cartNotification = document.createElement('div');
cartNotification.id = 'cartNotification';
cartNotification.className = 'cart-notification';
cartNotification.innerHTML = `
  <svg class="checkmark" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
  <span id="notificationText"></span>
`;
document.body.appendChild(cartNotification);

function showNotification(message) {
  const notification = document.getElementById('cartNotification');
  const notificationText = document.getElementById('notificationText');
  notificationText.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

// addToCart function
function addToCart(name, price, id = null, image = null, isPackage = false) {
  // Generate unique ID if not provided
  const itemId = id || `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  
  const existingItem = cart.find(item => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ 
      name: name,
      price: parseFloat(price),
      quantity: 1,
      id: itemId,
      image: image || './images/logo.png',
      isPackage: isPackage
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${name} added to cart!`);

  // Remove the confirm dialog for packages
  if (isPackage) {
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 1000);
  }
}


function setupCartButtons() {
  // Use event delegation for dynamically added buttons
  document.addEventListener('click', function(e) {
    const button = e.target.closest('.add-to-cart');
    if (button) {
      e.preventDefault();
      const name = button.dataset.name;
      const price = button.dataset.price;
      const id = button.dataset.id;
      const image = button.dataset.image;

      // Visual feedback
      const originalHTML = button.innerHTML;
      button.innerHTML = '<svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Added';
      button.classList.add('bg-green-500');
      
      setTimeout(() => {
        button.innerHTML = originalHTML.includes('Grab') ? 'Grab Deal' : 'Add to Cart';
        button.classList.remove('bg-green-500');
      }, 1500);

      addToCart(name, price, id,image); // Set isPackage to true
    }
  });

  // Update Buy Now buttons
  document.addEventListener('click', function(e) {
    if (e.target.closest('.buy-now-btn')) {
      e.preventDefault();
      const button = e.target.closest('.buy-now-btn');
      const productCard = button.closest('.product-card');
      const name = productCard.querySelector('h3').textContent;
      const priceText = productCard.querySelector('.text-blue-900').textContent;
      const price = parseFloat(priceText.replace('$', '')) || 0;
      const id = button.getAttribute('data-id');
      const image = productCard.querySelector('img').src;
      
      addToCart(name, price, id, image);
      showNotification(`${name} added to cart!`);
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 1000);
    }
  });
}



// Marquee functionality
function setupMarquee() {
  const marquee = document.querySelector('.animate-marquee');
  if (marquee) {
    marquee.innerHTML += marquee.innerHTML;
    
    marquee.addEventListener('animationiteration', function() {
      marquee.style.transform = 'translateX(0)';
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Product data
  const products = [
    {
      id: 1,
      name: "Super Softener",
      image: "./images/liquid1.png",
      description: "Self-wringing spin mop with microfiber head for superior",
      price: "$29.99",
      rating: 5,
      reviews: 128,
      tag: "BESTSELLER"
    },
    {
      id: 2,
      name: "Surface Cleaner",
      image: "./images/liquid2.png",
      description: "Steam mop with adjustable settings for all floor types",
      price: "$49.99",
      rating: 5,
      reviews: 94,
      tag: ""
    },
    {
      id: 3,
      name: "Mop Lotion",
      image: "./images/liquid3.png",
      description: "Ultra-thin mop with washable microfiber pads (3 included)",
      price: "$34.99",
      rating: 4,
      reviews: 37,
      tag: "NEW"
    },
    {
      id: 4,
      name: "Super Softener",
      image: "./images/liquid1.png",
      description: "Traditional sponge mop with replaceable head and sturdy design",
      price: "$12.99",
      rating: 3,
      reviews: 42,
      tag: ""
    },
    {
      id: 5,
      name: "Deep Clean",
      image: "./images/liquid2.png",
      description: "Heavy-duty mop for industrial cleaning with extra-long handle",
      price: "$39.99",
      rating: 4,
      reviews: 56,
      tag: "LIMITED"
    },
    {
      id: 6,
      name: "Eco Clean Solution",
      image: "./images/liquid3.png",
      description: "Environmentally friendly cleaning solution with natural ingredients",
      price: "$24.99",
      rating: 5,
      reviews: 78,
      tag: "ECO"
    },
    {
      id: 7,
      name: "Quick Shine Polish",
      image: "./images/liquid1.png",
      description: "Quick-drying floor polish that leaves a brilliant shine natural",
      price: "$19.99",
      rating: 4,
      reviews: 63,
      tag: ""
    },
    {
      id: 8,
      name: "Stain Remover Pro",
      image: "./images/liquid2.png",
      description: "Professional strength stain remover for tough spots natural",
      price: "$27.99",
      rating: 5,
      reviews: 112,
      tag: "BESTSELLER"
    }
  ];

  // Get container elements
  const productContainer = document.getElementById('product-container');
  const moreProductsContainer = document.getElementById('more-products-container');
  const viewMoreBtn = document.getElementById('view-more-btn');

  // Function to create product card HTML
  function createProductCard(product) {
    const stars = Array(5).fill().map((_, i) => 
      i < product.rating 
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`
    ).join('');

    const ribbon = product.tag ? `<div class="ribbon"><span>${product.tag}</span></div>` : '';

    return `
      <div class="product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
        ${ribbon}
        <div class="relative overflow-hidden group">
          <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-contain transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-1">${product.name}</h3>
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400">
              ${stars}
            </div>
            <span class="text-gray-600 text-sm ml-2">(${product.reviews})</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">${product.description}</p>
          <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-bold text-blue-900">${product.price}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button class="buy-now-btn px-3 py-2 bg-orange-400 text-gray-900 rounded-lg hover:bg-orange-500 transition-colors duration-300 text-center text-sm font-medium flex items-center justify-center" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Buy Now
            </button>
            <a href="https://wa.me/1234567890?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}" class="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 text-center text-sm font-medium flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Render initial products (first 4)
  products.slice(0, 4).forEach(product => {
    productContainer.innerHTML += createProductCard(product);
  });

  // Render more products (next 4)
  products.slice(4, 8).forEach(product => {
    moreProductsContainer.innerHTML += createProductCard(product);
  });

  // View More button functionality
  viewMoreBtn.addEventListener('click', function() {
    moreProductsContainer.classList.toggle('hidden');
    this.textContent = moreProductsContainer.classList.contains('hidden') 
      ? 'View More Products' 
      : 'View Less';
    
    // Smooth scroll to bottom when showing more products
    if (!moreProductsContainer.classList.contains('hidden')) {
      setTimeout(() => {
        moreProductsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get the video element and play button
  const videoContainer = document.querySelector('#eco .group');
  const video = videoContainer.querySelector('video');
  const playButton = videoContainer.querySelector('.video-play-button');
  
  // Function to toggle play/pause
  function togglePlayPause() {
      if (video.paused) {
          video.play();
          playButton.classList.add('opacity-0');
      } else {
          video.pause();
          playButton.classList.remove('opacity-0');
      }
  }
  
  // Click event for the video
  video.addEventListener('click', function(e) {
      e.preventDefault();
      togglePlayPause();
  });
  
  // Click event for the play button
  playButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent triggering the video click event
      togglePlayPause();
  });
  
  // Update play button visibility based on video state
  video.addEventListener('play', function() {
      playButton.classList.add('opacity-0');
  });
  
  video.addEventListener('pause', function() {
      playButton.classList.remove('opacity-0');
  });
  
  // Initially show play button if video is paused (might be due to autoplay restrictions)
  if (video.paused) {
      playButton.classList.remove('opacity-0');
  }
});
// View More Deals button functionality
document.getElementById('view-more-deals')?.addEventListener('click', function() {
  const moreDealsContainer = document.getElementById('more-deals-container');
  const viewMoreBtn = document.getElementById('view-more-deals');
  
  moreDealsContainer.classList.toggle('hidden');
  viewMoreBtn.textContent = moreDealsContainer.classList.contains('hidden') 
    ? 'View More Deals' 
    : 'View Less';
  
  // Smooth scroll to bottom when showing more deals
  if (!moreDealsContainer.classList.contains('hidden')) {
    setTimeout(() => {
      moreDealsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
});
// Pricing toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Set up package buttons
  document.querySelectorAll('.pricing-button').forEach(button => {
    button.addEventListener('click', function() {
      const packageName = this.dataset.name;
      const packagePrice = parseFloat(this.dataset.price);
      const packageId = this.dataset.id;
      const packageImage = this.dataset.image;
      addPackageToCart(packageName, packagePrice, packageId, packageImage);
    });
  });
});

// Subscribe Form
function setupSubscribeForm() {
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (input) {
        const email = input.value;
        const originalFormHTML = subscribeForm.innerHTML;
        
        // Show success message
        subscribeForm.innerHTML = `
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Success!</strong>
            <span class="block sm:inline">Thank you for subscribing with ${email}.</span>
          </div>
        `;
        
        // Reset form after 3 seconds
        setTimeout(function() {
          subscribeForm.innerHTML = originalFormHTML;
        }, 3000);
      }
    });
  }
}

// Intersection Observer for animations
function setupAnimations() {
  const animateElements = document.querySelectorAll('.fade-in');
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(function(el) {
      observer.observe(el);
    });
  }
}

// Smooth scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize all functions when DOM is loaded
// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart from localStorage
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Initial cart count update
  updateCartCount();

  // Rest of your initialization code
  initSwiper();
  setupNavbarScroll();
  setupMobileMenu();
  setupCartButtons();
  setupSearch();
  setupMarquee();
  setupSubscribeForm();
  setupAnimations();
  setupSmoothScrolling();

  // Load cart and display if on checkout page
  if (window.location.pathname.includes('checkout.html')) {
    displayCartItems();
  }
});