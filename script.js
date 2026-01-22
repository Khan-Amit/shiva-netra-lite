// ==========================================
// SHIVA NETRA LITE - SIMPLE WORKING VERSION
// ==========================================

console.log('🚀 Shiva Netra Lite - Loading...');

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Get elements
    const form = document.getElementById('earlyAccessForm');
    const successMsg = document.getElementById('successMessage');
    const welcomeMsg = document.getElementById('welcomeMessage');
    const loader = document.getElementById('loader');
    
    // Check if user already submitted
    checkExistingUser();
    
    // Setup form submission
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('📝 Form submitted');
            
            // Get form values
            const userData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim() || '',
                birthYear: document.getElementById('birthYear').value || '',
                interest: document.getElementById('interest').value || 'general',
                submittedAt: new Date().toISOString()
            };
            
            console.log('Collected data:', userData);
            
            // Validate
            if (!validateForm(userData)) {
                return;
            }
            
            // Show loader
            showLoader(true);
            
            // Save the data
            saveUserData(userData);
            
            // Hide form, show success
            setTimeout(function() {
                form.style.display = 'none';
                successMsg.style.display = 'block';
                showLoader(false);
                
                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth' });
                
                // Save to localStorage
                localStorage.setItem('shiva_user_email', userData.email);
                localStorage.setItem('shiva_user_name', userData.name);
                localStorage.setItem('shiva_user_data', JSON.stringify(userData));
                
                console.log('✅ User saved:', userData.email);
                
            }, 1500);
        });
    }
    
    console.log('✅ Setup complete');
});

// Check if user already signed up
function checkExistingUser() {
    const savedEmail = localStorage.getItem('shiva_user_email');
    if (savedEmail) {
        console.log('Found existing user:', savedEmail);
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.style.display = 'block';
        }
    }
}

// Validate form data
function validateForm(data) {
    // Check required fields
    if (!data.name || data.name.length < 2) {
        alert('Please enter your full name (at least 2 characters)');
        return false;
    }
    
    if (!data.email) {
        alert('Please enter your email address');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Save user data
function saveUserData(userData) {
    // Save to localStorage (always works)
    try {
        // Get existing submissions
        let submissions = JSON.parse(localStorage.getItem('shiva_submissions') || '[]');
        
        // Add new submission
        submissions.push({
            ...userData,
            id: Date.now(),
            savedAt: new Date().toISOString()
        });
        
        // Keep only last 10 submissions
        if (submissions.length > 10) {
            submissions = submissions.slice(-10);
        }
        
        localStorage.setItem('shiva_submissions', JSON.stringify(submissions));
        console.log('✅ Saved to localStorage');
        
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
    
    // Try to save to Firebase if available (optional)
    saveToFirebaseIfPossible(userData);
}

// Optional Firebase save
function saveToFirebaseIfPossible(userData) {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.log('Firebase not loaded - skipping');
        return;
    }
    
    try {
        // Your Firebase config (replace with your actual config)
        const firebaseConfig = {
            apiKey: "AIzaSyYOUR_API_KEY_HERE",
            authDomain: "your-project.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abcdef123456"
        };
        
        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        const db = firebase.firestore();
        const userId = userData.email.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Prepare data for Firestore
        const firestoreData = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            birthYear: userData.birthYear || '',
            interest: userData.interest || 'general',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'website'
        };
        
        // Save to Firestore
        db.collection('early_access_users').doc(userId).set(firestoreData, { merge: true })
            .then(() => console.log('✅ Saved to Firebase'))
            .catch(error => console.warn('Firebase save warning:', error));
            
    } catch (error) {
        console.log('Firebase save skipped:', error);
    }
}

// Show/hide loader
function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Debug functions (available in console)
window.debugShiva = {
    clearData: function() {
        localStorage.clear();
        alert('All local data cleared');
        console.log('✅ LocalStorage cleared');
    },
    
    viewData: function() {
        const data = {
            email: localStorage.getItem('shiva_user_email'),
            name: localStorage.getItem('shiva_user_name'),
            submissions: JSON.parse(localStorage.getItem('shiva_submissions') || '[]')
        };
        console.log('📊 Current data:', data);
        return data;
    },
    
    testForm: function() {
        // Fill form with test data
        document.getElementById('name').value = 'Test User';
        document.getElementById('email').value = 'test@example.com';
        document.getElementById('phone').value = '+1234567890';
        document.getElementById('birthYear').value = '1990';
        document.getElementById('interest').value = 'general';
        console.log('✅ Test data filled');
    }
};

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('✨ Shiva Netra Lite ready!');
