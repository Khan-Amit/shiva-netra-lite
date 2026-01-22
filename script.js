// ==========================================
// SHIVA NETRA LITE - FULL DATE COLLECTION
// ==========================================

console.log('🕉️ Shiva Netra Lite - Loading...');

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded - Initializing...');
    
    // Initialize everything
    initializeApp();
});

// Main initialization
function initializeApp() {
    console.log('🔄 Initializing...');
    
    // 1. Populate ALL date dropdowns
    populateDateDropdowns();
    
    // 2. Setup form
    setupForm();
    
    // 3. Load existing data
    loadData();
    
    console.log('✅ App initialized!');
}

// ==========================================
// DATE DROPDOWNS - DAY, MONTH, YEAR
// ==========================================

function populateDateDropdowns() {
    console.log('📅 Setting up date dropdowns...');
    
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 1. Populate DAYS (1-31)
    const daySelect = document.getElementById('birthDay');
    if (daySelect) {
        daySelect.innerHTML = '<option value="">Day</option>';
        for (let day = 1; day <= 31; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            daySelect.appendChild(option);
        }
        console.log('✅ Days populated: 1-31');
    }
    
    // 2. Populate MONTHS (1-12)
    const monthSelect = document.getElementById('birthMonth');
    if (monthSelect) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        monthSelect.innerHTML = '<option value="">Month</option>';
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = (index + 1).toString().padStart(2, '0');
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        console.log('✅ Months populated');
    }
    
    // 3. Populate YEARS (1900-current)
    const yearSelect = document.getElementById('birthYear');
    if (yearSelect) {
        yearSelect.innerHTML = '<option value="">Year</option>';
        for (let year = currentYear; year >= 1900; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        console.log(`✅ Years populated: 1900-${currentYear}`);
    }
}

// ==========================================
// FORM HANDLING WITH FULL DATE
// ==========================================

function setupForm() {
    const form = document.getElementById('earlyAccessForm');
    if (!form) {
        console.error('❌ Form not found!');
        return;
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📝 Form submitted!');
        
        // Get ALL form values
        const formData = {
            // Basic info
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone')?.value.trim() || '',
            interest: document.getElementById('interest')?.value || 'general',
            
            // FULL DATE (day, month, year)
            birthDay: document.getElementById('birthDay')?.value || '',
            birthMonth: document.getElementById('birthMonth')?.value || '',
            birthYear: document.getElementById('birthYear')?.value || '',
            
            // Timestamps
            timestamp: new Date().toLocaleString(),
            isoDate: new Date().toISOString(),
            id: Date.now()
        };
        
        console.log('Form data collected:', formData);
        
        // Validate
        if (!validateForm(formData)) {
            return;
        }
        
        // Format full date string
        const fullDate = formatFullDate(formData.birthDay, formData.birthMonth, formData.birthYear);
        formData.fullDate = fullDate;
        
        // Show loading
        showLoading(true);
        
        // Save data
        setTimeout(function() {
            saveUserData(formData);
            
            // Hide form, show success
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('dataDisplay').style.display = 'block';
            
            // Load and display data
            loadData();
            
            // Hide loading
            showLoading(false);
            
            console.log('✅ Form processed!');
            
        }, 1000);
    });
}

// Format date as YYYY-MM-DD
function formatFullDate(day, month, year) {
    if (!day || !month || !year) {
        return 'Date not complete';
    }
    
    // Ensure 2-digit format
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    
    return `${year}-${formattedMonth}-${formattedDay}`;
}

// Format date for display (e.g., "January 15, 1990")
function formatDateForDisplay(day, month, year) {
    if (!day || !month || !year) {
        return 'Date not provided';
    }
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
}

// ==========================================
// VALIDATION
// ==========================================

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
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address (format: name@domain.com)');
        return false;
    }
    
    // Check if date is partially filled (optional but validate if partially filled)
    const hasSomeDate = data.birthDay || data.birthMonth || data.birthYear;
    const hasAllDate = data.birthDay && data.birthMonth && data.birthYear;
    
    if (hasSomeDate && !hasAllDate) {
        if (confirm('You provided only part of your birth date. Continue without complete date?')) {
            return true;
        } else {
            return false;
        }
    }
    
    // Validate date if complete
    if (hasAllDate) {
        const day = parseInt(data.birthDay);
        const month = parseInt(data.birthMonth);
        const year = parseInt(data.birthYear);
        
        // Check valid date
        const date = new Date(year, month - 1, day);
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
            alert('Please enter a valid date (e.g., February has 28/29 days)');
            return false;
        }
        
        // Check not in future
        const today = new Date();
        if (date > today) {
            alert('Birth date cannot be in the future');
            return false;
        }
        
        // Check reasonable age (not older than 150 years)
        const age = today.getFullYear() - year;
        if (age > 150) {
            alert('Please enter a realistic birth year');
            return false;
        }
    }
    
    return true;
}

// ==========================================
// DATA STORAGE & DISPLAY
// ==========================================

// Save data
function saveUserData(data) {
    try {
        // Get existing submissions
        let submissions = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        
        // Add new submission
        submissions.unshift(data);
        
        // Keep only last 50
        if (submissions.length > 50) {
            submissions = submissions.slice(0, 50);
        }
        
        // Save back
        localStorage.setItem('shivaNetraSubmissions', JSON.stringify(submissions));
        
        // Also save last submission
        localStorage.setItem('shivaNetraLastSubmission', JSON.stringify(data));
        localStorage.setItem('shivaNetraUserEmail', data.email);
        localStorage.setItem('shivaNetraUserName', data.name);
        
        console.log('✅ Data saved. Total:', submissions.length);
        return true;
        
    } catch (error) {
        console.error('❌ Save error:', error);
        alert('Error saving data. Please try again.');
        return false;
    }
}

// Load and display data
function loadData() {
    const submissionsList = document.getElementById('submissionsList');
    if (!submissionsList) return;
    
    try {
        // Get data
        const submissions = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        
        if (submissions.length === 0) {
            submissionsList.innerHTML = '<p style="color:#666;text-align:center;">No submissions yet. Be the first!</p>';
            return;
        }
        
        // Create HTML
        let html = '<div style="max-height:400px;overflow-y:auto;">';
        
        submissions.forEach((sub, index) => {
            // Format date for display
            const displayDate = formatDateForDisplay(sub.birthDay, sub.birthMonth, sub.birthYear);
            
            html += `
                <div style="
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <strong style="color:#4c51bf;font-size:16px;">${sub.name}</strong>
                            <div style="color:#718096;font-size:14px;">${sub.email}</div>
                        </div>
                        <span style="color:#a0aec0;font-size:12px;">#${index + 1}</span>
                    </div>
                    
                    <div style="margin-top:10px;font-size:14px;">
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            <span><strong>📅 Date:</strong> ${displayDate}</span>
                            <span><strong>📞 Phone:</strong> ${sub.phone || 'Not provided'}</span>
                            <span><strong>🎯 Interest:</strong> ${sub.interest}</span>
                        </div>
                        <div style="color:#cbd5e0;font-size:12px;margin-top:5px;">
                            Submitted: ${sub.timestamp}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add summary
        html += `
            <div style="
                background: #f7fafc;
                padding: 10px;
                border-radius: 6px;
                margin-top: 15px;
                text-align: center;
                border: 1px dashed #cbd5e0;
            ">
                <strong>Total Submissions:</strong> ${submissions.length}
            </div>
        `;
        
        submissionsList.innerHTML = html;
        console.log(`✅ Displayed ${submissions.length} submissions`);
        
    } catch (error) {
        console.error('❌ Display error:', error);
        submissionsList.innerHTML = '<p style="color:#e53e3e;">Error loading data</p>';
    }
}

// ==========================================
// UI HELPERS
// ==========================================

// Show/hide loader
function showLoading(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure? This will delete ALL saved data!')) {
        localStorage.removeItem('shivaNetraSubmissions');
        localStorage.removeItem('shivaNetraLastSubmission');
        localStorage.removeItem('shivaNetraUserEmail');
        localStorage.removeItem('shivaNetraUserName');
        
        alert('All data cleared!');
        location.reload();
    }
}

// Make function global
window.clearAllData = clearAllData;

// ==========================================
// DEBUG TOOLS
// ==========================================

// Add debug functions to console
window.debugShiva = {
    // View all data
    viewData: function() {
        const data = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        console.log('📊 All submissions:', data);
        console.log('Total:', data.length);
        return data;
    },
    
    // Add test entry
    addTest: function() {
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            birthDay: '15',
            birthMonth: '01',
            birthYear: '1990',
            interest: 'general',
            timestamp: new Date().toLocaleString(),
            id: Date.now()
        };
        
        saveUserData(testData);
        loadData();
        alert('✅ Test data added!');
    },
    
    // Check storage
    storage: function() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        console.log('🗃️ LocalStorage keys:', keys);
        return keys;
    }
};

console.log('✨ Shiva Netra Lite ready! Use debugShiva.viewData() to check data.');
