// --- Espera a que todo el contenido del HTML esté cargado antes de ejecutar el script ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Estado del Carrito y LocalStorage ---
    // Intenta cargar el carrito desde localStorage. Si no existe, inicializa un array vacío.
    // JSON.parse convierte la cadena de texto de localStorage de nuevo a un objeto/array de JavaScript.
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Selectores de Elementos del DOM ---
    // Referencias a los elementos del HTML que vamos a manipular.
    const cartList = document.getElementById('cart-products-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // --- Funciones Principales del Carrito ---
    function addProductToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            // Si el producto ya existe en el carrito, incrementa su cantidad.
            cart[existingProductIndex].quantity++;
        } else {
            // Si es un producto nuevo, lo añade al carrito con cantidad 1.
            cart.push({ ...product, quantity: 1 });
        }

        // Vuelve a dibujar el carrito para reflejar los cambios.
        saveCart();
        renderCart();
    }

    /**
     * Dibuja (renderiza) los productos del carrito en el panel lateral (offcanvas).
     */
    function renderCart() {
        cartList.innerHTML = ''; // Limpia la lista actual para no duplicar elementos.

        if (cart.length === 0) {
            cartList.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(product => {
                const card = document.createElement('div');
                card.className = 'cart-product-card mb-3 d-flex align-items-center p-2 rounded shadow-sm';
                card.style.background = '#fff';
                card.style.border = '1px solid #0388A6';
                // Se usa `data-id` en los botones para saber a qué producto se refieren.
                card.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" class="rounded me-2" style="width:60px;height:60px;object-fit:cover;">
                    <div class="flex-grow-1">
                        <div class="fw-bold" style="color:#023059;">${product.name}</div>
                        <div style="color:#03658C; font-size:0.95rem;">$${product.price.toLocaleString()}</div>
                    </div>
                    <div class="d-flex align-items-center ms-2">
                        <button class="btn btn-sm btn-outline-secondary px-2 py-0" data-id="${product.id}" data-action="decrease">-</button>
                        <span class="mx-2">${product.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary px-2 py-0" data-id="${product.id}" data-action="increase">+</button>
                    </div>
                    <button class="btn btn-sm btn-danger ms-2" data-id="${product.id}" data-action="remove" aria-label="Eliminar">&times;</button>
                `;
                cartList.appendChild(card);
            });
        }
        updateCartTotal();
    }

    /**
     * Actualiza la cantidad de un producto o lo elimina.
     */
    function updateQuantity(productId, change) { // La función ahora es interna, no necesita ser global
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex > -1) {
            cart[productIndex].quantity += change;
            if (cart[productIndex].quantity <= 0) {
                // Si la cantidad llega a 0 o menos, elimina el producto del carrito.
                cart.splice(productIndex, 1);
            }
            saveCart();
            renderCart();
        }
    }

    /**
     * Calcula el precio total de todos los productos en el carrito y lo muestra.
     */
    function updateCartTotal() {
        const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        cartTotalSpan.textContent = total.toLocaleString();
    }

    // --- Event Listeners ---

    // Añade un listener a cada botón "Agregar al carrito".
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productData = event.currentTarget.dataset;
            const product = {
                id: productData.id,
                name: productData.name,
                price: parseFloat(productData.price),
                img: productData.img
            };
            addProductToCart(product);
        });
    });

    // Listener para los botones DENTRO del carrito (+, -, x).
    cartList.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.id;
        const action = target.dataset.action;

        if (action === 'increase') updateQuantity(productId, 1);
        if (action === 'decrease') updateQuantity(productId, -1);
        if (action === 'remove') updateQuantity(productId, -Infinity); // Elimina sin importar la cantidad
    });

    // --- Renderizado Inicial ---
    // Dibuja el carrito en cuanto la página carga para mostrar los productos guardados en localStorage.
    renderCart();
});