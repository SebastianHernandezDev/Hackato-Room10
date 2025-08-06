document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregar = document.querySelectorAll(".btn-agregar");

    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            // Obtener datos del producto desde la card
            const card = e.target.closest(".card-surf");
            const titulo = card.querySelector(".titulo").textContent;
            const descripcion = card.querySelector(".descripcion").textContent;
            const precio = card.querySelector(".precio span").textContent;
            const imagen = card.querySelector("img").getAttribute("src");

            // Crear objeto del producto
            const producto = {
                titulo,
                descripcion,
                precio,
                imagen
            };

            // Obtener carrito actual
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // Agregar producto
            carrito.push(producto);

            // Guardar en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito));

            alert("Producto agregado al carrito");
        });
    });
});

  function mostrarCarrito() {
    const contenedor = document.getElementById("cart-products-list");
    const total = document.getElementById("cart-total");

    // Limpiar antes de volver a cargar
    contenedor.innerHTML = "";
    let sumaTotal = 0;

    // Obtener productos del localStorage
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];

    productos.forEach((producto, index) => {
      const item = document.createElement("div");
      item.classList.add("item-carrito");

      // Si el precio no es numérico, ignora en el total
      let precioLimpio = parseFloat(producto.precio.replace(/[^0-9.]/g, '')) || 0;
      sumaTotal += precioLimpio;

      item.innerHTML = `
        <div class="card-carrito">
          <img src="${producto.imagen}" alt="${producto.titulo}" class="img-carrito">
          <div>
            <h6>${producto.titulo}</h6>
            <p>${producto.precio}</p>
          </div>
        </div>
        <hr>
      `;

      contenedor.appendChild(item);
    });

    // Mostrar total
    total.textContent = sumaTotal.toFixed(2);
  }

  // Mostrar carrito al abrir el offcanvas
  const carritoOffcanvas = document.getElementById('carritoOffcanvas');
  carritoOffcanvas.addEventListener('show.bs.offcanvas', mostrarCarrito);



