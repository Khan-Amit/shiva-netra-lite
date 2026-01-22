// ==========================================
// SHIVA NETRA LITE - script.js (BIRTHDAY FIXED)
// ==========================================

console.log('🚀 Shiva Netra Lite - Loading...');

// DOM Elements
let earlyAccessForm, contactForm, loader, successMessage;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing app...');
    
    // Get DOM elements
    earlyAccessForm = document.getElementById('earlyAccessForm');
    contactForm = document.getElementById('contactForm');
    loader = document.getElementById('loader');
    successMessage = document.getElementById('successMessage');
    
    // Setup event listeners FIRST
    setupEventListeners();
    
    // Check for existing user
    checkExistingUser();
    
    // Initialize Firebase (if used) - with error handling
    setTimeout(() => {
        try {
            initializeFirebase();
        } catch (error) {
            console.log('Firebase optional - running in local mode');
        }
    }, 100);
    
    console.log('✅ App initialized');
});

// ==========================================
// FIREBASE CONFIGURATION (OPTIONAL)
// ==========================================

// Your Firebase Configuration - REPLACE WITH YOUR VALUES or KEEP EMPTY
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

let db = null;
let firebaseInitialized = false;

function initializeFirebase() {
    // If config is empty, skip Firebase
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
        console.log('⚠️ No Firebase config found - running in local mode');
        return false;
    }
    
    try {
        if (typeof firebase === 'undefined') {
            console.log('Firebase not loaded - skipping');
            return false;
        }
        
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('🔥 Firebase initialized');
        }
        
        db = firebase.firestore();
        firebaseInitialized = true;
        return true;
        
    } catch (error) {
        console.log('Firebase init error - continuing without it:', error);
        return false;
    }
}

// ==========================================
// BIRTHDAY HANDLING - ULTRA FIXED!
// ==========================================

// **FIX 1: Parse ANY date format**
function parseBirthday(dateString) {
    if (!dateString || dateString.trim() === '') {
        return null;
    }
    
    console.log('Parsing birthday:', dateString);
    
    // Try different date formats
    let date = null;
    
    // Format 1: YYYY-MM-DD (HTML date input)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split('-');
        date = new Date(parts[0], parts[1] - 1, parts[2]); // Month is 0-indexed
    }
    // Format 2: DD/MM/YYYY or MM/DD/YYYY
    else if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            // Try DD/MM/YYYY first (more common globally)
            if (parts[0].length === 2 && parts[1].length === 2) {
                date = new Date(parts[2], parts[1] - 1, parts[0]);
            }
            // Try MM/DD/YYYY
            else if (parts[0].length <= 2 && parts[1].length === 2) {
                date = new Date(parts[2], parts[0] - 1, parts[1]);
            }
        }
    }
    // Format 3: Try native Date parsing
    else {
        date = new Date(dateString);
    }
    
    // Validate the date
    if (!date || isNaN(date.getTime())) {
        console.warn('Invalid date format, using null:', dateString);
        return null;
    }
    
    // Check if date is reasonable (not in future, not before 1900)
    const now = new Date();
    const minDate = new Date(1900, 0, 1);
    
    if (date > now) {
        console.warn('Date is in future, adjusting to today');
        date = new Date(); // Use today
    }
    
    if (date < minDate) {
        console.warn('Date is too old, using 1990');
        date = new Date(1990, 0, 1);
    }
    
    console.log('Parsed date:', date.toISOString());
    return date;
}

// **FIX 2: Convert to Firestore format SAFELY**
function convertBirthdayForFirestore(birthdayString) {
    const date = parseBirthday(birthdayString);
    
    if (!date) {
        return null;
    }
    
    // If Firebase is available, return Timestamp
    if (firebaseInitialized && firebase.firestore) {
        return firebase.firestore.Timestamp.fromDate(date);
    }
    
    // Otherwise return ISO string
    return date.toISOString();
}

// **FIX 3: Format for display**
function formatBirthdayForDisplay(birthday) {
    if (!birthday) return '';
    
    try {
        let date;
        
        if (birthday.toDate && typeof birthday.toDate === 'function') {
            date = birthday.toDate();
        } else if (birthday instanceof Date) {
            date = birthday;
        } else {
            date = new Date(birthday);
        }
        
        if (isNaN(date.getTime())) {
            return '';
        }
        
        // Format: January 15, 1990
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
    } catch (error) {
        console.error('Error formatting birthday:', error);
        return '';
    }
}

// ==========================================
// FORM SETUP WITH BIRTHDAY FIXES
// ==========================================

function setupEventListeners() {
    // Early Access Form
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', handleEarlyAccessSubmit);
        console.log('✅ Early access form listener added');
    }
    
    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        console.log('✅ Contact form listener added');
    }
    
    // **FIX 4: Set up birthday input with proper attributes**
    setupBirthdayInput();
    
    // Setup other inputs
    setupInputValidation();
}

// **FIX 5: Configure birthday input properly**
function setupBirthdayInput() {
    const birthdayInput = document.getElementById('birthday');
    
    if (birthdayInput) {
        // Set input attributes for better mobile experience
        birthdayInput.setAttribute('type', 'date');
        birthdayInput.setAttribute('max', new Date().toISOString().split('T')[0]); // No future dates
        
        // Set placeholder text
        birthdayInput.setAttribute('placeholder', 'YYYY-MM-DD');
        
        // Add helpful title/tooltip
        birthdayInput.setAttribute('title', 'Enter your birth date (YYYY-MM-DD)');
        
        console.log('✅ Birthday input configured');
        
        // **FIX 6: Add manual date entry fallback**
        birthdayInput.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // If user types something that's not YYYY-MM-DD, help them
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                console.log('User entered non-standard date:', value);
                // Don't reject it - we'll parse it later
            }
        });
    }
}

function setupInputValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = 'red';
                showToast('Please enter a valid email', 'warning');
            } else {
                this.style.borderColor = '';
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==========================================
// FORM HANDLING
// ==========================================

async function handleEarlyAccessSubmit(event) {
    event.preventDefault();
    console.log('📝 Form submitted');
    
    // Get form values
    const formData = {
        name: getValue('name'),
        email: getValue('email'),
        phone: getValue('phone') || '',
        birthday: getValue('birthday') || '',
        interest: getValue('interest') || 'general',
        submittedAt: new Date().toISOString()
    };
    
    console.log('Form data:', formData);
    
    // **FIX 7: Validate birthday but don't block submission**
    if (formData.birthday) {
        const parsedDate = parseBirthday(formData.birthday);
        if (!parsedDate) {
            console.warn('Birthday parse failed, but continuing anyway');
            // We'll save it as string instead
        }
    }
    
    // Basic validation
    if (!formData.name || !formData.email) {
        showToast('Name and email are required', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    // Show loading
    showLoading(true, 'Saving...');
    
    try {
        // Save to database
        const saved = await saveUserData(formData);
        
        if (saved) {
            // Save to localStorage as backup
            saveToLocalStorage(formData);
            
            // Show success
            showToast('✅ Thank you! You\'re on the early access list.', 'success');
            
            // Reset form
            event.target.reset();
            
            // Optional: Show confirmation
            setTimeout(() => {
                const thankyouDiv = document.getElementById('thankyou');
                if (thankyouDiv) {
                    thankyouDiv.style.display = 'block';
                    thankyouDiv.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ Form error:', error);
        showToast('⚠️ Saved locally. Will sync when online.', 'warning');
        
        // Save to localStorage as fallback
        saveToLocalStorage(formData);
        
    } finally {
        showLoading(false);
    }
}

async function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: getValue('contactName'),
        email: getValue('contactEmail'),
        message: getValue('message'),
        submittedAt: new Date().toISOString()
    };
    
    if (!formData.name || !formData.email || !formData.message) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    showLoading(true, 'Sending...');
    
    try {
        await saveContactMessage(formData);
        showToast('✅ Message sent!', 'success');
        event.target.reset();
    } catch (error) {
        console.error('Contact error:', error);
        showToast('⚠️ Saved locally', 'warning');
        
        // Save to localStorage
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(formData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
    } finally {
        showLoading(false);
    }
}

// ==========================================
// DATA SAVING
// ==========================================

async function saveUserData(userData) {
    console.log('Saving user data:', userData);
    
    try {
        // **FIX 8: Process birthday safely**
        const processedData = {
            ...userData,
            // Convert birthday if it exists
            birthday: userData.birthday ? convertBirthdayForFirestore(userData.birthday) : null,
            processedAt: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // Try Firebase first
        if (firebaseInitialized && db) {
            const userId = userData.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            await db.collection('early_access').doc(userId).set({
                ...processedData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Saved to Firebase');
            return true;
        }
        
        // If no Firebase, just return true (saved to localStorage in caller)
        console.log('⚠️ Saved to localStorage only');
        return true;
        
    } catch (error) {
        console.error('Save error:', error);
        throw error;
    }
}

async function saveContactMessage(contactData) {
    if (firebaseInitialized && db) {
        await db.collection('contacts').add({
            ...contactData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    }
    throw new Error('Firebase not available');
}

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveToLocalStorage(data) {
    try {
        // Save this submission
        localStorage.setItem('last_submission', JSON.stringify(data));
        
        // Add to history
        const history = JSON.parse(localStorage.getItem('submission_history') || '[]');
        history.push({
            ...data,
            savedAt: new Date().toISOString()
        });
        
        // Keep only last 5
        if (history.length > 5) {
            history.shift();
        }
        
        localStorage.setItem('submission_history', JSON.stringify(history));
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_name', data.name);
        
        console.log('✅ Saved to localStorage');
        
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
}

function checkExistingUser() {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
        console.log('Welcome back:', savedEmail);
        // You could update UI here
    }
}

// ==========================================
// UI HELPERS
// ==========================================

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function showLoading(show, message = 'Loading...') {
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>${message}</p>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            display: none;
        `;
        
        // Add spinner styles
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #2563eb;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loader);
    }
    
    if (show) {
        loader.style.display = 'flex';
        const text = loader.querySelector('p');
        if (text) text.textContent = message;
    } else {
        loader.style.display = 'none';
    }
}

function showToast(message, type = 'info') {
    // Remove existing toast
    const oldToast = document.getElementById('toast');
    if (oldToast) oldToast.remove();
    
    // Create new toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;
    
    // Style based on type
    const styles = {
        success: 'background: #10b981; color: white;',
        error: 'background: #ef4444; color: white;',
        warning: 'background: #f59e0b; color: white;',
        info: 'background: #3b82f6; color: white;'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9998;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        ${styles[type] || styles.info}
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }
    }, 5000);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// INITIALIZATION & ERROR HANDLING
// ==========================================

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Don't break the page
    event.preventDefault();
    
    // Show user-friendly message
    if (event.filename && event.filename.includes('firebase')) {
        console.log('Firebase error - ignoring');
    }
});

// Make debugging easy
window.debugShiva = {
    clearData: () => {
        localStorage.clear();
        console.log('All local data cleared');
        showToast('Data cleared', 'info');
    },
    viewData: () => {
        const data = {
            last: localStorage.getItem('last_submission'),
            history: localStorage.getItem('submission_history'),
            user: {
                email: localStorage.getItem('user_email'),
                name: localStorage.getItem('user_name')
            }
        };
        console.log('Local data:', data);
        return data;
    },
    testDate: (dateStr) => {
        console.log('Testing date:', dateStr);
        console.log('Parsed:', parseBirthday(dateStr));
    }
};

console.log('✨ Shiva Netra Lite script.js loaded!');
