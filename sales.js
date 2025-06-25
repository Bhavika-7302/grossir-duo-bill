
// Sales page specific JavaScript
class SalesManager {
    constructor() {
        this.filteredProducts = [...pos.products];
        this.initializeEventListeners();
        this.displayProducts();
        pos.updateCartDisplay();
    }

    initializeEventListeners() {
        // Product search
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => this.searchProducts(e.target.value));
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Bill modal buttons
        const printBillBtn = document.getElementById('printBillBtn');
        const newSaleBtn = document.getElementById('newSaleBtn');
        const closeBillModal = document.getElementById('closeBillModal');

        if (printBillBtn) {
            printBillBtn.addEventListener('click', () => pos.printBill());
        }

        if (newSaleBtn) {
            newSaleBtn.addEventListener('click', () => this.startNewSale());
        }

        if (closeBillModal) {
            closeBillModal.addEventListener('click', () => this.closeBillModal());
        }
    }

    displayProducts() {
        const productList = document.getElementById('productList');
        if (!productList) return;

        if (this.filteredProducts.length === 0) {
            productList.innerHTML = `
                <div class="col-span-full text-center text-gray-500 py-8">
                    <p data-telugu="ఉత్పత్తులు కనుగొనబడలేదు" data-english="No products found">No products found</p>
                </div>
            `;
        } else {
            productList.innerHTML = this.filteredProducts.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                    <div class="text-green-600 font-bold text-xl mb-2">₹${product.price.toFixed(2)}</div>
                    <div class="text-sm text-gray-600 mb-3">
                        <span data-telugu="స్టాక్:" data-english="Stock:">Stock:</span> ${product.stock}
                    </div>
                    <button onclick="salesManager.addProductToCart(${product.id})" 
                            class="btn w-full bg-blue-600 hover:bg-blue-700" 
                            ${product.stock <= 0 ? 'disabled' : ''}>
                        <span data-telugu="కార్ట్‌కు జోడించు" data-english="Add to Cart">Add to Cart</span>
                    </button>
                </div>
            `).join('');
        }

        pos.updateLanguageDisplay();
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredProducts = [...pos.products];
        } else {
            this.filteredProducts = pos.products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
        }
        
        this.displayProducts();
    }

    addProductToCart(productId) {
        const product = pos.products.find(p => p.id === productId);
        if (!product || product.stock <= 0) return;

        // Check if adding one more would exceed stock
        const existingCartItem = pos.cart.find(item => item.id === productId);
        const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
        
        if (currentQuantityInCart >= product.stock) {
            alert(pos.isEnglish ? 'Not enough stock available!' : 'తగినంత స్టాక్ అందుబాటులో లేదు!');
            return;
        }

        pos.addToCart(product, 1);
        
        // Show success feedback
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                productCard.style.transform = 'scale(1)';
            }, 150);
        }
    }

    checkout() {
        if (pos.cart.length === 0) return;

        const bill = pos.generateBill();
        if (bill) {
            pos.showBill(bill);
        }
    }

    startNewSale() {
        this.closeBillModal();
        pos.clearCart();
        
        // Clear search
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.value = '';
            this.searchProducts('');
        }
    }

    closeBillModal() {
        const modal = document.getElementById('billModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Initialize sales manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!pos.currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    window.salesManager = new SalesManager();
});
