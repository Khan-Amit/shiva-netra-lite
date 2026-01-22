// ==========================================
// SHIVA NETRA LITE - script.js
// Main Application File
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
    
    // Initialize Firebase (if used)
    initializeApp();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for existing user
    checkExistingUser();
});

// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

// Your Firebase Configuration - REPLACE WITH YOUR ACTUAL VALUES!
const firebaseConfig = {
    apiKey: "AIzaSyABC123YOUR_API_KEY_HERE",
    authDomain: "shiva-netra-lite.firebaseapp.com",
    projectId: "shiva-netra-lite",
    storageBucket: "shiva-netra-lite.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

let db;
let firebaseInitialized = false;

// Initialize Firebase
function initializeFirebase() {
    try {
        // Check if Firebase scripts are loaded
        if (typeof firebase === 'undefined') {
            console.warn('Firebase not loaded, loading now...');
            loadFirebaseScripts();
            return false;
        }
        
        // Initialize if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('🔥 Firebase initialized successfully');
        }
        
        // Get Firestore reference
        db = firebase.firestore();
        firebaseInitialized = true;
        
        // Test connection
        testFirebaseConnection();
        
        return true;
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        return false;
    }
}

// Load Firebase scripts dynamically
function loadFirebaseScripts() {
    const scripts = [
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js',
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'
    ];
    
    let loaded = 0;
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loaded++;
            if (loaded === scripts.length) {
                console.log('✅ Firebase scripts loaded');
                initializeFirebase();
            }
        };
        document.head.appendChild(script);
    });
}

// Test Firebase connection
function testFirebaseConnection() {
    if (!db) return;
    
    db.collection('test').doc('connection').get()
        .then(() => console.log('✅ Firebase connection successful'))
        .catch(err => console.warn('⚠️ Firebase connection test failed:', err));
}

// ==========================================
// BIRTHDAY HANDLING - FIXED!
// ==========================================

// Convert birthday to Firestore Timestamp (FIXED VERSION)
function convertToFirestoreTimestamp(birthdayString) {
    if (!birthdayString) {
        console.warn('No birthday provided, returning null');
        return null;
    }
    
    try {
        // Parse the date (handles YYYY-MM-DD, MM/DD/YYYY, etc.)
        const date = new Date(birthdayString);
        
        // Validate date
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date string: ${birthdayString}`);
        }
        
        // Convert to Firestore Timestamp
        if (firebaseInitialized && firebase.firestore) {
            return firebase.firestore.Timestamp.fromDate(date);
        } else {
            // Fallback: return as string if Firebase not available
            console.warn('Firebase not available, returning date string');
            return date.toISOString();
        }
        
    } catch (error) {
        console.error('❌ Error converting birthday:', error);
        // Return current timestamp as fallback
        if (firebaseInitialized && firebase.firestore) {
            return firebase.firestore.Timestamp.now();
        }
        return new Date().toISOString();
    }
}

// Format birthday for display
function formatBirthdayForDisplay(birthday) {
    if (!birthday) return 'Not specified';
    
    try {
        let date;
        
        // Handle Firestore Timestamp
        if (birthday.toDate && typeof birthday.toDate === 'function') {
            date = birthday.toDate();
        }
        // Handle JavaScript Date
        else if (birthday instanceof Date) {
            date = birthday;
        }
        // Handle string or number
        else {
            date = new Date(birthday);
        }
        
        // Check if valid
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        
        // Format nicely
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
    } catch (error) {
        console.error('Error formatting birthday:', error);
        return 'Date format error';
    }
}

// ==========================================
// FORM HANDLING
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
    
    // Add input validation
    addInputValidation();
}

// Handle Early Access form submission
async function handleEarlyAccessSubmit(event) {
    event.preventDefault();
    console.log('📝 Early access form submitted');
    
    // Get form values
    const formData = {
        name: getValue('name'),
        email: getValue('email'),
        phone: getValue('phone') || '',
        birthday: getValue('birthday') || '',
        interest: getValue('interest') || 'general',
        submittedAt: new Date().toISOString()
    };
    
    // Validate
    if (!validateFormData(formData)) {
        return;
    }
    
    // Show loading
    showLoading(true, 'Saving your information...');
    
    try {
        // Save to database
        const saved = await saveUserData(formData);
        
        if (saved) {
            // Save to localStorage as backup
            saveToLocalStorage(formData);
            
            // Show success
            showSuccessMessage('Thank you! You are now on our early access list.');
            
            // Reset form
            event.target.reset();
            
            // Optional: Redirect or show confirmation
            setTimeout(() => {
                window.location.hash = 'thankyou';
            }, 2000);
        }
        
    } catch (error) {
        console.error('❌ Form submission error:', error);
        showErrorMessage('Failed to save. Please try again or contact us.');
    } finally {
        showLoading(false);
    }
}

// Handle Contact form submission
async function handleContactSubmit(event) {
    event.preventDefault();
    console.log('📧 Contact form submitted');
    
    const formData = {
        name: getValue('contactName'),
        email: getValue('contactEmail'),
        message: getValue('message'),
        submittedAt: new Date().toISOString()
    };
    
    if (!formData.name || !formData.email || !formData.message) {
        showErrorMessage('Please fill all fields');
        return;
    }
    
    showLoading(true, 'Sending your message...');
    
    try {
        await saveContactMessage(formData);
        showSuccessMessage('Message sent! We will respond within 24 hours.');
        event.target.reset();
    } catch (error) {
        console.error('Contact form error:', error);
        showErrorMessage('Failed to send message. Please try email instead.');
    } finally {
        showLoading(false);
    }
}

// ==========================================
// DATABASE OPERATIONS
// ==========================================

// Save user data to Firestore
async function saveUserData(userData) {
    try {
        // If Firebase is not initialized, save to localStorage only
        if (!firebaseInitialized) {
            console.warn('Firebase not available, saving to localStorage only');
            saveToLocalStorage(userData);
            return true;
        }
        
        // Generate user ID from email
        const userId = userData.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        // Prepare data for Firestore
        const firestoreData = {
            ...userData,
            // Convert birthday to proper format
            birthday: convertToFirestoreTimestamp(userData.birthday),
            // Add metadata
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'website_form',
            version: '1.0'
        };
        
        // Save to Firestore
        await db.collection('early_access_users').doc(userId).set(firestoreData, { merge: true });
        
        console.log('✅ User data saved to Firestore:', userId);
        return true;
        
    } catch (error) {
        console.error('❌ Error saving to Firestore:', error);
        
        // Fallback: Save to localStorage
        saveToLocalStorage(userData);
        
        // Try to save to a backup collection
        try {
            if (db) {
                await db.collection('backup_submissions').add({
                    ...userData,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (backupError) {
            console.error('Backup also failed:', backupError);
        }
        
        return false;
    }
}

// Save contact message
async function saveContactMessage(contactData) {
    if (!firebaseInitialized) {
        console.warn('Firebase not available for contact form');
        // Save to localStorage as fallback
        const contacts = JSON.parse(localStorage.getItem('shiva_contacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('shiva_contacts', JSON.stringify(contacts));
        return true;
    }
    
    try {
        await db.collection('contact_messages').add({
            ...contactData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'new'
        });
        return true;
    } catch (error) {
        console.error('Error saving contact:', error);
        throw error;
    }
}

// ==========================================
// LOCAL STORAGE (FALLBACK)
// ==========================================

function saveToLocalStorage(data) {
    try {
        // Save individual user
        localStorage.setItem('shiva_last_submission', JSON.stringify(data));
        
        // Add to submissions history
        const submissions = JSON.parse(localStorage.getItem('shiva_submissions') || '[]');
        submissions.push({
            ...data,
            storedAt: new Date().toISOString()
        });
        
        // Keep only last 10 submissions
        if (submissions.length > 10) {
            submissions.shift();
        }
        
        localStorage.setItem('shiva_submissions', JSON.stringify(submissions));
        localStorage.setItem('shiva_user_email', data.email);
        localStorage.setItem('shiva_user_name', data.name);
        
        console.log('✅ Data saved to localStorage');
        
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
}

function checkExistingUser() {
    const savedEmail = localStorage.getItem('shiva_user_email');
    if (savedEmail) {
        console.log('Found existing user:', savedEmail);
        updateUIForExistingUser(savedEmail);
    }
}

function updateUIForExistingUser(email) {
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement) {
        const name = localStorage.getItem('shiva_user_name') || email.split('@')[0];
        welcomeElement.textContent = `Welcome back, ${name}!`;
        welcomeElement.style.display = 'block';
    }
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

function addInputValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Date validation
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateDate(this);
        });
    });
}

function validateFormData(data) {
    // Check required fields
    if (!data.name || !data.email) {
        showErrorMessage('Name and email are required');
        return false;
    }
    
    // Validate email format
    if (!isValidEmail(data.email)) {
        showErrorMessage('Please enter a valid email address');
        return false;
    }
    
    // Validate date if provided
    if (data.birthday) {
        const date = new Date(data.birthday);
        if (isNaN(date.getTime())) {
            showErrorMessage('Please enter a valid date');
            return false;
        }
        
        // Optional: Check if date is realistic (not in future, not too old)
        const today = new Date();
        const minDate = new Date('1900-01-01');
        
        if (date > today) {
            showErrorMessage('Birthday cannot be in the future');
            return false;
        }
        
        if (date < minDate) {
            showErrorMessage('Please enter a valid birth year');
            return false;
        }
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmail(input) {
    if (input.value && !isValidEmail(input.value)) {
        input.classList.add('error');
        return false;
    }
    input.classList.remove('error');
    return true;
}

function validateDate(input) {
    if (input.value) {
        const date = new Date(input.value);
        if (isNaN(date.getTime())) {
            input.classList.add('error');
            return false;
        }
    }
    input.classList.remove('error');
    return true;
}

// ==========================================
// UI HELPER FUNCTIONS
// ==========================================

function getValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value.trim() : '';
}

function showLoading(show, message = 'Loading...') {
    if (!loader) {
        // Create loader if it doesn't exist
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            flex-direction: column;
        `;
        
        loader.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #2563eb;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="margin-top: 20px; color: #333; font-size: 16px;">${message}</p>
        `;
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
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

function showSuccessMessage(message) {
    alert(message); // Simple alert for mobile
    
    // You can replace with a nicer notification
    console.log('✅ Success:', message);
}

function showErrorMessage(message) {
    alert(message); // Simple alert for mobile
    console.error('❌ Error:', message);
}

// ==========================================
// APP INITIALIZATION
// ==========================================

function initializeApp() {
    console.log('🚀 Initializing Shiva Netra Lite...');
    
    // Try to initialize Firebase
    const firebaseLoaded = initializeFirebase();
    
    if (!firebaseLoaded) {
        console.log('⚠️ Running in offline mode - data will be saved locally');
        
        // Show offline indicator
        const offlineIndicator = document.createElement('div');
        offlineIndicator.id = 'offlineIndicator';
        offlineIndicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #f59e0b;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
        `;
        offlineIndicator.textContent = 'Offline Mode';
        document.body.appendChild(offlineIndicator);
    }
    
    console.log('✅ App initialization complete');
}

// ==========================================
// ERROR HANDLING
// ==========================================

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    
    // Don't break the whole page
    event.preventDefault();
    
    // Show user-friendly error
    if (event.error.message && event.error.message.includes('birthday')) {
        console.log('Birthday format error detected, attempting recovery...');
        // Try to recover by using current date
        const birthdayInput = document.getElementById('birthday');
        if (birthdayInput) {
            birthdayInput.value = '';
            birthdayInput.placeholder = 'YYYY-MM-DD (Optional)';
        }
    }
});

// ==========================================
// EXPORT FUNCTIONS (for debugging)
// ==========================================

// Make functions available in console for debugging
window.shivaNetra = {
    testFirebase: () => testFirebaseConnection(),
    saveTestData: () => saveUserData({
        name: 'Test User',
        email: 'test@example.com',
        birthday: '1990-01-01'
    }),
    clearLocalData: () => {
        localStorage.clear();
        console.log('LocalStorage cleared');
    },
    getLocalData: () => {
        return {
            lastSubmission: JSON.parse(localStorage.getItem('shiva_last_submission') || '{}'),
            submissions: JSON.parse(localStorage.getItem('shiva_submissions') || '[]'),
            userEmail: localStorage.getItem('shiva_user_email')
        };
    }
};

console.log('✨ script.js loaded successfully!');
