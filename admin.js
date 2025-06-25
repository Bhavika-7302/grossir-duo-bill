
// Admin page specific JavaScript
class AdminManager {
    constructor() {
        this.activeTab = 'dashboard';
        this.initializeEventListeners();
        this.updateDashboard();
    }

    initializeEventListeners() {
        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Bill view modal
        const closeBillViewModal = document.getElementById('closeBillViewModal');
        if (closeBillViewModal) {
            closeBillViewModal.addEventListener('click', () => this.closeBillViewModal());
        }
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show selected tab content
        const activeContent = document.getElementById(`${tabId}Tab`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        this.activeTab = tabId;

        // Load specific tab content
        switch (tabId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'sales':
                this.loadSalesTab();
                break;
            case 'inventory':
                this.loadInventoryTab();
                break;
            case 'reports':
                this.loadReportsTab();
                break;
        }
    }

    updateDashboard() {
        // Update stats
        const totalBills = document.getElementById('totalBills');
        const totalSales = document.getElementById('totalSales');
        const averageBill = document.getElementById('averageBill');

        if (totalBills) {
            totalBills.textContent = pos.bills.length;
        }

        if (totalSales) {
            const total = pos.bills.reduce((sum, bill) => sum + bill.total, 0);
            totalSales.textContent = pos.formatCurrency(total);
        }

        if (averageBill) {
            const total = pos.bills.reduce((sum, bill) => sum + bill.total, 0);
            const average = pos.bills.length > 0 ? total / pos.bills.length : 0;
            averageBill.textContent = pos.formatCurrency(average);
        }

        // Update bills table
        this.updateBillsTable();
    }

    updateBillsTable() {
        const billsTableBody = document.getElementById('billsTableBody');
        if (!billsTableBody) return;

        billsTableBody.innerHTML = pos.bills.map(bill => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="p-3 font-medium text-blue-600">${bill.billNo}</td>
                <td class="p-3 text-gray-600">${bill.timestamp}</td>
                <td class="p-3 text-right font-semibold text-green-600">₹${bill.total.toFixed(2)}</td>
                <td class="p-3 text-center">
                    <button onclick="adminManager.viewBill('${bill.id}')" 
                            class="btn btn-sm bg-blue-500 hover:bg-blue-600" 
                            data-telugu="చూడండి" data-english="View">
                        View
                    </button>
                </td>
            </tr>
        `).join('');

        pos.updateLanguageDisplay();
    }

    viewBill(billId) {
        const bill = pos.bills.find(b => b.id === billId);
        if (!bill) return;

        const modal = document.getElementById('billViewModal');
        const content = document.getElementById('billViewContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="bill-header">
                <h2>Grossir POS</h2>
                <p><strong>Bill No:</strong> ${bill.billNo}</p>
                <p><strong>Date & Time:</strong> ${bill.timestamp}</p>
            </div>
            <div class="bill-items">
                <table class="w-full">
                    <thead>
                        <tr class="border-b-2 border-gray-300">
                            <th class="text-left p-2" data-telugu="వస్తువు" data-english="Item">Item</th>
                            <th class="text-center p-2" data-telugu="పరిమాణం" data-english="Qty">Qty</th>
                            <th class="text-right p-2" data-telugu="రేటు" data-english="Rate">Rate</th>
                            <th class="text-right p-2" data-telugu="మొత్తం" data-english="Amount">Amount</th>
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
            <div class="bill-total text-right border-t-2 border-gray-300 pt-4 mt-4">
                <h3 class="text-xl font-bold">
                    <span data-telugu="మొత్తం మొత్తం:" data-english="Grand Total:">Grand Total:</span> 
                    ₹${bill.total.toFixed(2)}
                </h3>
            </div>
        `;

        modal.classList.remove('hidden');
        pos.updateLanguageDisplay();
    }

    closeBillViewModal() {
        const modal = document.getElementById('billViewModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    loadSalesTab() {
        const salesTab = document.getElementById('salesTab');
        if (salesTab) {
            // Embed sales functionality in iframe or load sales components
            console.log('Loading sales tab');
        }
    }

    loadInventoryTab() {
        const inventoryTab = document.getElementById('inventoryTab');
        if (inventoryTab) {
            // Load inventory management features
            console.log('Loading inventory tab');
        }
    }

    loadReportsTab() {
        const reportsTab = document.getElementById('reportsTab');
        if (reportsTab) {
            // Load reports and analytics
            console.log('Loading reports tab');
        }
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    if (!pos.currentUser || pos.currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    window.adminManager = new AdminManager();
});
