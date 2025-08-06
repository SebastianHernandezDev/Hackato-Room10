function addProductToCart({id, name, price, img, quantity}) {
    const cartList = document.getElementById('cart-products-list');
    const card = document.createElement('div');
    card.className = 'cart-product-card mb-3 d-flex align-items-center p-2 rounded shadow-sm';
    card.style.background = '#fff';
    card.style.border = '1px solid #0388A6';
    card.innerHTML = `
        <img src="${img}" alt="${name}" class="rounded me-2" style="width:60px;height:60px;object-fit:cover;">
        <div class="flex-grow-1">
            <div class="fw-bold" style="color:#023059;">${name}</div>
            <div style="color:#03658C; font-size:0.95rem;">$${price.toLocaleString()}</div>
        </div>
        <div class="d-flex align-items-center ms-2">
            <button class="btn btn-sm btn-outline-secondary px-2 py-0">-</button>
            <span class="mx-2">${quantity}</span>
            <button class="btn btn-sm btn-outline-secondary px-2 py-0">+</button>
        </div>
    `;
    cartList.appendChild(card);
}

addProductToCart({
    id: 1,
    name: 'Tabla de surf',
    price: 120000,
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80',
    quantity: 1
});