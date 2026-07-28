/*CART*/
/*mariam hany*/
document.addEventListener('DOMContentLoaded', () => {
  
    const cartSidebar = document.getElementById('cartSidebar');
    const mainContentWrapper = document.getElementById('mainContentWrapper');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const headerCartBtn = document.getElementById('headerCartBtn'); 
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const emptyMessage = document.querySelector('.empty-cart-message');
    
    
    const addToCartBtns = document.querySelectorAll('.product-btn');

    let cart = []; 

    function saveCart() {
        localStorage.setItem('shoppingCartData', JSON.stringify(cart));
    }
    
   
    function loadCart() {
        const storedCart = localStorage.getItem('shoppingCartData');
        if (storedCart) {
           
            cart = JSON.parse(storedCart);
        }
    }

    function getProductInfo(button) {
        const card = button.closest('.product-card');
        const name = card.querySelector('h3').textContent.trim();
        const priceText = card.querySelector('.price').textContent.trim();
    
        const price = parseFloat(priceText.replace(' EGP', ''));
        const imgSrc = card.querySelector('img') ? card.querySelector('img').src : 'default.png'; 
        return { name, price, imgSrc };
    }

   
    function updateCartUI() {
        let totalItems = 0;
        let total = 0;

        cartItemsContainer.innerHTML = ''; 

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            confirmOrderBtn.disabled = true; 
        } else {
            emptyMessage.style.display = 'none';
            confirmOrderBtn.disabled = false;
        }
        cart.forEach(item => {
            totalItems += item.quantity;
            total += item.price * item.quantity;
            
            const subtotal = item.price * item.quantity; 

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} EGP x ${item.quantity} = <b>${subtotal.toFixed(2)} EGP</b></p>
                </div>
                <div class="item-controls">
                    <button data-name="${item.name}" class="control-btn decrease-qty">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button data-name="${item.name}" class="control-btn increase-qty">+</button>
                    <button data-name="${item.name}" class="delete-item">🗑</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });


        cartCountElement.textContent = totalItems;
        cartTotalElement.textContent = total.toFixed(2) + ' EGP';
        

        saveCart();
    }

    function addItemToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI(); 
       
    }
    addToCartBtns.forEach(button => {
        button.addEventListener('click', () => {
            const product = getProductInfo(button);
            addItemToCart(product);
        });
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const name = target.getAttribute('data-name');
        const itemIndex = cart.findIndex(item => item.name === name);

        if (itemIndex > -1) {
            if (target.classList.contains('increase-qty')) {
                cart[itemIndex].quantity++;
            } else if (target.classList.contains('decrease-qty')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                }
            } else if (target.classList.contains('delete-item')) {
                cart.splice(itemIndex, 1);
            }
            updateCartUI(); 
        }
    });

    function openCart() {
        cartSidebar.classList.add('open');
   
        if (mainContentWrapper) {
            mainContentWrapper.style.marginRight = '300px'; 
        }
    }


    function closeCart() {
        cartSidebar.classList.remove('open');

        if (mainContentWrapper) {
            mainContentWrapper.style.marginRight = '0'; 
        }
    }

    function toggleCart() {
        if (cartSidebar.classList.contains('open')) {
            closeCart();
        } else {
            openCart();
        }
    }

    openCartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', closeCart);
    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            toggleCart();
        });
    }

    cancelOrderBtn.addEventListener('click', closeCart);
    
    confirmOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty! Please add items before placing an order.");
            return;
        }
      
        localStorage.setItem('shoppingCart', JSON.stringify(cart)); 
        window.location.href = 'checkout.html';
    });

    loadCart(); 
    updateCartUI(); 
});