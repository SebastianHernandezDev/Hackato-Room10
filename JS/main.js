document.addEventListener("DOMContentLoaded", () => {    
    // Guardamos referencias a los elementos HTML con los que vamos a interactuar.
    const carritoOffcanvas = document.getElementById('carritoOffcanvas');
    const botonesAgregar = document.querySelectorAll(".btn-agregar");
    const contenedorCarrito = document.getElementById("cart-products-list");
    const btnVaciar = document.getElementById("btn-vaciar-carrito");

    // --- Lógica para Agregar Productos ---
    // Se añade un "escuchador de eventos" a cada botón "Agregar al carrito".
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            // Cuando se hace clic, se busca la tarjeta de producto más cercana.
            const card = evento.target.closest(".card-surf");
            const productoId = card.dataset.id;
            const titulo = card.querySelector(".titulo").textContent;
            const precio = card.querySelector(".precio").textContent;
            const imagen = card.querySelector("img").getAttribute("src");

            // Se crea un objeto con la información del producto.
            const producto = {
                id: productoId,
                titulo,
                precio,
                imagen
            };

            // Se llama a la función para añadir el producto al carrito.
            agregarAlCarrito(producto);
            alert("Producto agregado al carrito");
        });
    });

    // --- Funciones del Carrito ---
    function agregarAlCarrito(producto) {
        let carrito = obtenerCarrito();
        // Busca si el producto ya está en el carrito usando su ID.
        const productoExistente = carrito.find(p => p.id === producto.id);

        if (productoExistente) {
            // Si existe, solo aumenta la cantidad.
            productoExistente.quantity++;
        } else {
            // Si es nuevo, le asigna cantidad 1 y lo añade al array.
            producto.quantity = 1;
            carrito.push(producto);
        }
        // Guarda el carrito actualizado en localStorage.
        guardarCarrito(carrito);
    }
    function actualizarCantidad(productoId, cambio) {
        let carrito = obtenerCarrito();
        const productoIndex = carrito.findIndex(p => p.id === productoId);

        if (productoIndex > -1) {
            carrito[productoIndex].quantity += cambio;
            if (carrito[productoIndex].quantity <= 0) {
                // Si la cantidad es 0 o menos, se elimina el producto
                carrito.splice(productoIndex, 1);
            }
        }
        guardarCarrito(carrito);
        mostrarCarrito(); // Vuelve a renderizar el carrito para mostrar los cambios
    }
    function mostrarCarrito() {
        const totalEl = document.getElementById("cart-total");
        contenedorCarrito.innerHTML = ""; // Limpia el contenido anterior.
        let sumaTotal = 0;
        const carrito = obtenerCarrito();

        // Si el carrito está vacío, muestra un mensaje.
        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
            totalEl.textContent = "0";
            return;
        }

        // Recorre cada producto en el carrito para crear su HTML.
        carrito.forEach((producto) => {
            const item = document.createElement("div");
            item.className = 'cart-product-card mb-3 d-flex align-items-center p-2 rounded shadow-sm';
            item.style.background = '#fff';
            item.style.border = '1px solid #0388A6';
            item.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}" class="rounded me-2" style="width:60px;height:60px;object-fit:cover;">
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color:#023059;">${producto.titulo}</div>
                    <div style="color:#03658C; font-size:0.95rem;">${producto.precio}</div>
                </div>
                <div class="d-flex align-items-center ms-2">
                    <button class="btn btn-sm btn-outline-secondary px-2 py-0" data-id="${producto.id}" data-action="disminuir" aria-label="Disminuir cantidad">-</button>
                    <span class="mx-2">${producto.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary px-2 py-0" data-id="${producto.id}" data-action="aumentar" aria-label="Aumentar cantidad">+</button>
                </div>
                <button class="btn btn-sm btn-danger ms-2" data-id="${producto.id}" data-action="eliminar" aria-label="Eliminar producto">&times;</button>
            `;

            // Limpia el string del precio para convertirlo a número y calcular el total.
            let precioLimpio = parseFloat(producto.precio.replace(/[^0-9.,$]/g, '')) || 0;
            sumaTotal += (precioLimpio * producto.quantity);

            contenedorCarrito.appendChild(item);
        });

        // Muestra el total formateado para la región de Colombia.
        totalEl.textContent = sumaTotal.toLocaleString('es-CO');
    }

    function obtenerCarrito() {
        // Si no hay nada en localStorage, devuelve un array vacío para evitar errores.
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }
    function guardarCarrito(carrito) {
        // Convierte el array de objetos a un string en formato JSON para poder guardarlo.
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // --- Event Listeners ---

    // Se usa "delegación de eventos": un solo listener en el contenedor para manejar
    // los clics en los botones que se crean dinámicamente (+, -, x).
    contenedorCarrito.addEventListener('click', (evento) => {
        // 'evento.target' es el elemento exacto donde se hizo clic.
        const target = evento.target;
        const action = target.dataset.action;
        const productoId = target.dataset.id;

        // Si no se hizo clic en un botón con 'action' y 'id', no hace nada.
        if (!action || !productoId) return;

        if (action === 'aumentar') {
            actualizarCantidad(productoId, 1);
        } else if (action === 'disminuir') {
            actualizarCantidad(productoId, -1);
        } else if (action === 'eliminar') {
            // Para eliminar, simplemente reducimos la cantidad a 0 o menos
            actualizarCantidad(productoId, -Infinity);
        }
    });

    // Escucha el evento de Bootstrap que se dispara justo cuando el offcanvas empieza a mostrarse.
    carritoOffcanvas.addEventListener('show.bs.offcanvas', mostrarCarrito);

    // Listener para el botón de vaciar carrito.
    btnVaciar.addEventListener('click', () => {
        // Opcional: Añadir una confirmación para evitar vaciarlo por accidente
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            // Crea un array vacío y lo guarda, efectivamente limpiando el carrito
            guardarCarrito([]);
            // Vuelve a renderizar el carrito para que se muestre vacío
            mostrarCarrito();
        }
    });
});
const cards = document.querySelectorAll('.card-surf');

cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped'); 
  });
});