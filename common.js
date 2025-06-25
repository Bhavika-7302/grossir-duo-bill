
// Common JavaScript functionality
class POS {
    constructor() {
        this.isEnglish = false;
        this.currentUser = null;
        this.cart = [];
        this.bills = [
            {
                id: '1',
                billNo: 'BILL-001',
                total: 45.50,
                timestamp: '2024-01-15 14:30:25',
                items: [
                    { name: 'Milk', quantity: 2, price: 3.50, total: 7.00 },
                    { name: 'Bread', quantity: 1, price: 2.50, total: 2.50 },
                    { name: 'Eggs', quantity: 3, price: 12.00, total: 36.00 }
                ]
            },
            {
                id: '2',
                billNo: 'BILL-002',
                total: 23.75,
                timestamp: '2024-01-15 15:45:10',
                items: [
                    { name: 'Rice', quantity: 1, price: 15.00, total: 15.00 },
                    { name: 'Salt', quantity: 2, price: 4.25, total: 8.50 }
                ]
            },
            {
                id: '3',
                billNo: 'BILL-003',
                total: 67.25,
                timestamp: '2024-01-15 16:20:45',
                items: [
                    { name: 'Chicken', quantity: 1, price: 25.00, total: 25.00 },
                    { name: 'Vegetables', quantity: 2, price: 8.50, total: 17.00 },
                    { name: 'Fruits', quantity: 3, price: 8.25, total: 25.25 }
                ]
            }
        ];
        this.products = [
            { id: 1, name: 'Milk', price: 3.50, stock: 50 },
            { id: 2, name: 'Bread', price: 2.50, stock: 30 },
            { id: 3, name: 'Eggs', price: 12.00, stock: 100 },
            { id: 4, name: 'Rice', price: 15.00, stock: 25 },
            { id: 5, name: 'Salt', price: 4.25, stock: 40 },
            { id: 6, name: 'Chicken', price: 25.00, stock: 15 },
            { id: 7, name: 'Vegetables', price: 8.50, stock: 35 },
            { id: 8, name: 'Fruits', price: 8.25, stock: 20 },
            { id: 9, name: 'Oil', price: 45.00, stock: 12 },
            { id: 10, name: 'Sugar', price: 6.75, stock: 60 }
        ];
        
        this.initializeLanguageToggle();
        this.loadUserData();
    }

    // Language functionality
    initializeLanguageToggle() {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.isEnglish = savedLanguage === 'english';
        }
        this.updateLanguageDisplay();
    }

    toggleLanguage() {
        this.isEnglish = !this.isEnglish;
        localStorage.setItem('language', this.isEnglish ? 'english' : 'telugu');
        this.updateLanguageDisplay();
    }

    updateLanguageDisplay() {
        // Update language toggle button
        const languageText = document.getElementById('languageText');
        if (languageText) {
            languageText.textContent = this.isEnglish ? '🇺🇸 English' : '🇮🇳 తెలుగు';
        }

        // Update all translatable elements
        const elements = document.querySelectorAll('[data-telugu][data-english]');
        elements.forEach(element => {
            const teluguText = element.getAttribute('data-telugu');
            const englishText = element.getAttribute('data-english');
            element.textContent = this.isEnglish ? englishText : teluguText;
        });

        // Update placeholder texts
        const placeholderElements = document.querySelectorAll('[data-telugu-placeholder][data-english-placeholder]');
        placeholderElements.forEach(element => {
            const teluguPlaceholder = element.getAttribute('data-telugu-placeholder');
            const englishPlaceholder = element.getAttribute('data-english-placeholder');
            element.placeholder = this.isEnglish ? englishPlaceholder : teluguPlaceholder;
        });
    }

    // User management
    saveUserData() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    loadUserData() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    logout() {
        this.currentUser = null;
        this.cart = [];
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // Cart functionality
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total = existingItem.quantity * existingItem.price;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                total: product.price * quantity
            });
        }
        
        this.updateCartDisplay();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                item.total = item.price * quantity;
                this.updateCartDisplay();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.total, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `<p class="text-gray-500 text-center" data-telugu="కార్ట్ ఖాళీగా ఉంది" data-english="Cart is empty">Cart is empty</p>`;
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div>
                        <div class="font-semibold">${item.name}</div>
                        <div class="text-sm text-gray-600">₹${item.price.toFixed(2)} × ${item.quantity}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="pos.updateCartQuantity(${item.id}, ${item.quantity - 1})" class="btn btn-sm">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="pos.updateCartQuantity(${item.id}, ${item.quantity + 1})" class="btn btn-sm">+</button>
                        <button onclick="pos.removeFromCart(${item.id})" class="btn btn-sm bg-red-500 hover:bg-red-600 text-white">×</button>
                    </div>
                </div>
            `).join('');
            if (checkoutBtn) checkoutBtn.disabled = false;
        }

        if (cartCount) cartCount.textContent = this.cart.length;
        if (cartTotal) cartTotal.textContent = `₹${this.getCartTotal().toFixed(2)}`;
        
        this.updateLanguageDisplay();
    }

    // Bill generation
    generateBill() {
        if (this.cart.length === 0) return null;

        const billNo = `BILL-${String(this.bills.length + 1).padStart(3, '0')}`;
        const timestamp = new Date().toLocaleString('en-IN');
        
        const bill = {
            id: String(this.bills.length + 1),
            billNo: billNo,
            timestamp: timestamp,
            items: [...this.cart],
            total: this.getCartTotal()
        };

        this.bills.push(bill);
        this.clearCart();
        
        return bill;
    }

    showBill(bill) {
        const modal = document.getElementById('billModal');
        const content = document.getElementById('billContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="bill-header">
                <h2>Grossir POS</h2>
                <p>Bill No: ${bill.billNo}</p>
                <p>${bill.timestamp}</p>
            </div>
            <div class="bill-items">
                <table class="w-full">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left p-2">Item</th>
                            <th class="text-center p-2">Qty</th>
                            <th class="text-right p-2">Rate</th>
                            <th class="text-right p-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.items.map(item => `
                            <tr class="border-b">
                                <td class="p-2">${item.name}</td>
                                <td class="text-center p-2">${item.quantity}</td>
                                <td class="text-right p-2">₹${item.price.toFixed(2)}</td>
                                <td class="text-right p-2">₹${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="bill-total text-right">
                <p>Total: ₹${bill.total.toFixed(2)}</p>
            </div>
            <div class="text-center mt-4">
                <p>Thank you for your business!</p>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    printBill() {
        window.print();
    }

    // Utility functions
    formatCurrency(amount) {
        return `₹${amount.toFixed(2)}`;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-IN');
    }
}

// Initialize POS system
const pos = new POS();

// Global event listeners for common elements
document.addEventListener('DOMContentLoaded', function() {
    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => pos.toggleLanguage());
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => pos.logout());
    }

    // Update user name display
    const userName = document.getElementById('userName');
    if (userName && pos.currentUser) {
        userName.textContent = pos.currentUser.name;
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close, [id$="CloseModal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    pos.updateLanguageDisplay();
});
