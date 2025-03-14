document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(res => res.json())
        .then(products => {
            const container = document.getElementById('products-container');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `<h2>${product.name}</h2><p>${product.description}</p><p>Price: ₹${product.price}</p><button onclick="addToCart(${product.id})">Add to Cart</button>`;
                container.appendChild(productDiv);
            });
        });
});

function addToCart(productId) {
    fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, product_id: productId, quantity: 1 })
    });
}