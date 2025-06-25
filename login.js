
// Login page specific JavaScript
class LoginManager {
    constructor() {
        this.userType = null;
        this.adminPin = '123456';
        this.userPin = '1234';
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // User type selection buttons
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        const userLoginBtn = document.getElementById('userLoginBtn');
        
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', () => this.selectUserType('admin'));
        }
        
        if (userLoginBtn) {
            userLoginBtn.addEventListener('click', () => this.selectUserType('user'));
        }

        // PIN entry form
        const pinInput = document.getElementById('pinInput');
        const loginBtn = document.getElementById('loginBtn');
        const backBtn = document.getElementById('backBtn');

        if (pinInput) {
            pinInput.addEventListener('input', (e) => this.handlePinInput(e));
            pinInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.attemptLogin();
                }
            });
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.attemptLogin());
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }
    }

    selectUserType(type) {
        this.userType = type;
        
        // Hide login type selection
        const loginTypeSelection = document.getElementById('loginTypeSelection');
        const pinEntrySection = document.getElementById('pinEntrySection');
        
        if (loginTypeSelection && pinEntrySection) {
            loginTypeSelection.classList.add('hidden');
            pinEntrySection.classList.remove('hidden');
        }

        // Update UI based on user type
        this.updatePinEntryUI();
        
        // Focus on PIN input
        const pinInput = document.getElementById('pinInput');
        if (pinInput) {
            pinInput.focus();
        }
    }

    updatePinEntryUI() {
        const loginTitle = document.getElementById('loginTitle');
        const loginSubtitle = document.getElementById('loginSubtitle');
        const pinInput = document.getElementById('pinInput');
        const loginBtn = document.getElementById('loginBtn');

        if (!loginTitle || !loginSubtitle || !pinInput || !loginBtn) return;

        if (this.userType === 'admin') {
            loginTitle.textContent = pos.isEnglish ? 'Admin Login' : 'అడ్మిన్ లాగిన్';
            loginSubtitle.textContent = pos.isEnglish ? 'Enter your 6-digit PIN' : 'మీ 6-అంకెల పిన్ ఎంటర్ చేయండి';
            pinInput.placeholder = pos.isEnglish ? 'Enter 6-digit PIN' : '6-అంకెల పిన్ ఎంటర్ చేయండి';
            pinInput.maxLength = 6;
            loginBtn.className = 'btn flex-1 bg-blue-600 hover:bg-blue-700';
        } else {
            loginTitle.textContent = pos.isEnglish ? 'User Login' : 'యూజర్ లాగిన్';
            loginSubtitle.textContent = pos.isEnglish ? 'Enter your 4-digit PIN' : 'మీ 4-అంకెల పిన్ ఎంటర్ చేయండి';
            pinInput.placeholder = pos.isEnglish ? 'Enter 4-digit PIN' : '4-అంకెల పిన్ ఎంటర్ చేయండి';
            pinInput.maxLength = 4;
            loginBtn.className = 'btn flex-1 bg-green-600 hover:bg-green-700';
        }
    }

    handlePinInput(e) {
        const input = e.target;
        const value = input.value;
        const maxLength = this.userType === 'admin' ? 6 : 4;
        
        // Only allow digits
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue !== value) {
            input.value = cleanValue;
        }
        
        // Limit length
        if (input.value.length > maxLength) {
            input.value = input.value.substr(0, maxLength);
        }
        
        // Clear any error messages
        this.clearError();
        
        // Enable/disable login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.disabled = input.value.length !== maxLength;
        }
    }

    attemptLogin() {
        const pinInput = document.getElementById('pinInput');
        if (!pinInput) return;
        
        const enteredPin = pinInput.value;
        const expectedPin = this.userType === 'admin' ? this.adminPin : this.userPin;
        
        if (enteredPin === expectedPin) {
            // Successful login
            const userData = {
                role: this.userType,
                name: this.userType === 'admin' ? 'Admin User' : 'Sales Staff'
            };
            
            pos.currentUser = userData;
            pos.saveUserData();
            
            // Redirect to appropriate page
            if (this.userType === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'sales.html';
            }
        } else {
            // Failed login
            this.showError(
                pos.isEnglish 
                    ? 'Invalid PIN. Please try again.' 
                    : 'తప్పుడు పిన్. దయచేసి మళ్లీ ప్రయత్నించండి.'
            );
            pinInput.value = '';
            pinInput.focus();
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
    }

    clearError() {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
    }

    goBack() {
        this.userType = null;
        
        // Show login type selection
        const loginTypeSelection = document.getElementById('loginTypeSelection');
        const pinEntrySection = document.getElementById('pinEntrySection');
        
        if (loginTypeSelection && pinEntrySection) {
            loginTypeSelection.classList.remove('hidden');
            pinEntrySection.classList.add('hidden');
        }
        
        // Clear PIN input and error
        const pinInput = document.getElementById('pinInput');
        if (pinInput) {
            pinInput.value = '';
        }
        
        this.clearError();
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (pos.currentUser) {
        if (pos.currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'sales.html';
        }
        return;
    }
    
    new LoginManager();
});
