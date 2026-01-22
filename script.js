// ==========================================
// SHIVA NETRA LITE - COMPLETE WORKING VERSION
// ==========================================

console.log('🚀 Shiva Netra Lite - Loading...');

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded - Initializing...');
    
    // Initialize everything
    initializeApp();
});

// Main initialization function
function initializeApp() {
    console.log('🔄 Initializing application...');
    
    // 1. Populate birth years
    populateBirthYears();
    
    // 2. Setup form submission
    setupForm();
    
    // 3. Load and display existing data
    loadData();
    
    // 4. Show debug tools
    setupDebugTools();
    
    console.log('✅ Application initialized successfully!');
}

// ==========================================
// BIRTH YEAR POPULATION (1900 to Current Year)
// ==========================================

function populateBirthYears() {
    const birthYearSelect = document.getElementById('birthYear');
    
    if (!birthYearSelect) {
        console.log('⚠️ Birth year select not found');
        return;
    }
    
    // Clear existing options except first
    while (birthYearSelect.options.length > 1) {
        birthYearSelect.remove(1);
    }
    
    // Get current year
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    
    // Add years from current year down to 1900
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        birthYearSelect.appendChild(option);
    }
    
    console.log(`✅ Populated birth years from ${startYear} to ${currentYear}`);
}

// ==========================================
// FORM HANDLING
// ==========================================

function setupForm() {
    const form = document.getElementById('earlyAccessForm');
    const successMessage = document.getElementById('successMessage');
    const dataDisplay = document.getElementById('dataDisplay');
    
    if (!form) {
        console.log('❌ Form not found! Check if ID is "earlyAccessForm"');
        return;
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📝 Form submitted!');
        
        // Get form values
        const formData = {
            id: Date.now(), // Unique ID based on timestamp
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || 'Not provided',
            birthYear: document.getElementById('birthYear').value || 'Not provided',
            interest: document.getElementById('interest').value || 'general',
            timestamp: new Date().toLocaleString(),
            date: new Date().toISOString().split('T')[0]
        };
        
        console.log('Form data collected:', formData);
        
        // Validate
        if (!validateFormData(formData)) {
            return;
        }
        
        // Show loading
        showLoader(true);
        
        // Save data
        setTimeout(function() {
            saveToStorage(formData);
            
            // Hide form, show success
            form.style.display = 'none';
            successMessage.style.display = 'block';
            dataDisplay.style.display = 'block';
            
            // Reload and display data
            loadData();
            
            // Hide loader
            showLoader(false);
            
            console.log('✅ Form processed successfully!');
            
            // Scroll to data display
            dataDisplay.scrollIntoView({ behavior: 'smooth' });
            
        }, 1000); // 1 second delay to show loader
    });
}

// Validate form data
function validateFormData(data) {
    // Check required fields
    if (!data.name || data.name.length < 2) {
        alert('Please enter your full name (at least 2 characters)');
        return false;
    }
    
    if (!data.email) {
        alert('Please enter your email address');
        return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address (format: name@domain.com)');
        return false;
    }
    
    return true;
}

// ==========================================
// DATA STORAGE & DISPLAY
// ==========================================

// Save data to localStorage
function saveToStorage(data) {
    try {
        // Get existing data
        let submissions = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        
        // Add new data at the beginning
        submissions.unshift(data);
        
        // Keep only last 50 entries
        if (submissions.length > 50) {
            submissions = submissions.slice(0, 50);
        }
        
        // Save back to localStorage
        localStorage.setItem('shivaNetraSubmissions', JSON.stringify(submissions));
        
        // Also save last submission separately
        localStorage.setItem('shivaNetraLastSubmission', JSON.stringify(data));
        localStorage.setItem('shivaNetraUserEmail', data.email);
        localStorage.setItem('shivaNetraUserName', data.name);
        
        console.log('✅ Data saved to localStorage:', data);
        return true;
        
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
        alert('Error saving data. Please try again.');
        return false;
    }
}

// Load and display data
function loadData() {
    const submissionsList = document.getElementById('submissionsList');
    const dataDisplay = document.getElementById('dataDisplay');
    
    if (!submissionsList) {
        console.log('⚠️ Submissions list element not found');
        return;
    }
    
    try {
        // Get data from localStorage
        const submissions = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        
        if (submissions.length === 0) {
            submissionsList.innerHTML = '<p style="color:#64748b; text-align:center;">No submissions yet. Be the first!</p>';
            if (dataDisplay) dataDisplay.style.display = 'none';
            return;
        }
        
        // Create HTML for submissions
        let html = '';
        
        submissions.forEach((submission, index) => {
            html += `
                <div class="submission-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; color: #4c51bf;">${submission.name}</h4>
                        <span style="font-size: 12px; color: #64748b;">${submission.timestamp}</span>
                    </div>
                    <p style="margin: 5px 0; color: #4a5568;"><strong>Email:</strong> ${submission.email}</p>
                    <div style="display: flex; gap: 15px; font-size: 14px; color: #718096;">
                        <span><strong>Phone:</strong> ${submission.phone}</span>
                        <span><strong>Birth Year:</strong> ${submission.birthYear}</span>
                        <span><strong>Interest:</strong> ${submission.interest}</span>
                    </div>
                </div>
            `;
        });
        
        submissionsList.innerHTML = html;
        
        // Show total count
        const countElement = document.createElement('p');
        countElement.innerHTML = `<strong>Total Submissions:</strong> ${submissions.length}`;
        countElement.style.cssText = 'margin-top: 15px; padding: 10px; background: #e2e8f0; border-radius: 5px; text-align: center;';
        
        submissionsList.appendChild(countElement);
        
        console.log(`✅ Loaded ${submissions.length} submissions`);
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        submissionsList.innerHTML = '<p style="color:#ef4444;">Error loading data</p>';
    }
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
        localStorage.removeItem('shivaNetraSubmissions');
        localStorage.removeItem('shivaNetraLastSubmission');
        localStorage.removeItem('shivaNetraUserEmail');
        localStorage.removeItem('shivaNetraUserName');
        
        alert('All data cleared successfully!');
        
        // Reload page to reset form
        location.reload();
    }
}

// ==========================================
// UI HELPER FUNCTIONS
// ==========================================

// Show/hide loader
function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Setup debug tools
function setupDebugTools() {
    // Add debug functions to window object
    window.shivaDebug = {
        // View all data
        viewData: function() {
            const data = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
            console.log('📊 All submissions:', data);
            console.log('Total:', data.length);
            return data;
        },
        
        // Add test data
        addTestData: function() {
            const testData = {
                id: Date.now(),
                name: 'Test User',
                email: 'test@example.com',
                phone: '+1234567890',
                birthYear: '1990',
                interest: 'general',
                timestamp: new Date().toLocaleString(),
                date: new Date().toISOString().split('T')[0]
            };
            
            saveToStorage(testData);
            loadData();
            alert('Test data added!');
        },
        
        // Check storage status
        checkStorage: function() {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i));
            }
            console.log('🗃️ LocalStorage keys:', keys);
            return keys;
        }
    };
    
    console.log('🔧 Debug tools available. Use: shivaDebug.viewData()');
}

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================

console.log('✨ Shiva Netra Lite script loaded successfully!');
