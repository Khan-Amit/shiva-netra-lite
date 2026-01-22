// ==========================================
// SHIVA NETRA LITE - COMPLETE SCRIPT
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
    console.log('🔄 Initializing application...');
    
    // 1. Populate date dropdowns
    populateDateDropdowns();
    
    // 2. Setup form submission
    setupForm();
    
    // 3. Check for existing user
    checkExistingUser();
    
    // 4. Load and display data
    loadAndDisplayData();
    
    // 5. Setup debug tools
    setupDebugTools();
    
    console.log('✅ Application initialized successfully!');
}

// ==========================================
// DATE DROPDOWNS
// ==========================================

function populateDateDropdowns() {
    console.log('📅 Populating date dropdowns...');
    
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 1. Days (1-31)
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
    
    // 2. Months (January-December)
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
    
    // 3. Years (1900-current)
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
// FORM HANDLING
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
        
        // Get form values
        const formData = {
            // Basic info
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || '',
            interest: document.getElementById('interest').value || 'general',
            
            // Date components
            birthDay: document.getElementById('birthDay').value,
            birthMonth: document.getElementById('birthMonth').value,
            birthYear: document.getElementById('birthYear').value,
            
            // Timestamps
            timestamp: new Date().toLocaleString(),
            submittedAt: new Date().toISOString(),
            id: Date.now()
        };
        
        console.log('Form data:', formData);
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Format full date
        formData.fullDate = formatFullDate(formData.birthDay, formData.birthMonth, formData.birthYear);
        formData.displayDate = formatDateForDisplay(formData.birthDay, formData.birthMonth, formData.birthYear);
        
        // Show loading
        showLoading(true, 'Saving your information...');
        
        // Process after delay
        setTimeout(function() {
            // Save data
            saveUserData(formData);
            
            // Hide form, show success
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('dataDisplay').style.display = 'block';
            
            // Update data display
            loadAndDisplayData();
            
            // Hide loading
            showLoading(false);
            
            // Scroll to data
            document.getElementById('dataDisplay').scrollIntoView({ behavior: 'smooth' });
            
            console.log('✅ Form processed successfully!');
            
        }, 1500);
    });
}

// ==========================================
// DATE FORMATTING
// ==========================================

function formatFullDate(day, month, year) {
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function formatDateForDisplay(day, month, year) {
    if (!day || !month || !year) return 'Date not provided';
    
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
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address (format: name@domain.com)');
        return false;
    }
    
    // Check date validation if partially filled
    const hasSomeDate = data.birthDay || data.birthMonth || data.birthYear;
    const hasAllDate = data.birthDay && data.birthMonth && data.birthYear;
    
    if (hasSomeDate && !hasAllDate) {
        if (!confirm('You provided only part of your birth date. Continue without complete date?')) {
            return false;
        }
    }
    
    // Validate full date if provided
    if (hasAllDate) {
        const day = parseInt(data.birthDay);
        const month = parseInt(data.birthMonth);
        const year = parseInt(data.birthYear);
        
        // Create date object
        const date = new Date(year, month - 1, day);
        
        // Check if date is valid
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
    }
    
    return true;
}

// ==========================================
// DATA STORAGE
// ==========================================

function saveUserData(data) {
    try {
        // Get existing data
        let allData = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        
        // Add new data at the beginning
        allData.unshift(data);
        
        // Keep only last 50 entries
        if (allData.length > 50) {
            allData = allData.slice(0, 50);
        }
        
        // Save back to localStorage
        localStorage.setItem('shivaNetraSubmissions', JSON.stringify(allData));
        
        // Save user info separately
        localStorage.setItem('shivaNetraUserEmail', data.email);
        localStorage.setItem('shivaNetraUserName', data.name);
        localStorage.setItem('shivaNetraLastSubmission', JSON.stringify(data));
        
        console.log('✅ Data saved. Total entries:', allData.length);
        return true;
        
    } catch (error) {
        console.error('❌ Error saving data:', error);
        alert('Error saving your data. Please try again.');
        return false;
    }
}

// ==========================================
// DATA DISPLAY
// ==========================================

function loadAndDisplayData() {
    const submissionsList = document.getElementById('submissionsList');
    const dataCount = document.getElementById('dataCount');
    const dataDisplay = document.getElementById('dataDisplay');
    
    if (!submissionsList || !dataCount) return;
    
    try {
        // Get data
        const data = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
        
        // Update count
        dataCount.textContent = `${data.length} submission${data.length !== 1 ? 's' : ''}`;
        
        if (data.length === 0) {
            submissionsList.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #666;">
                    <p style="font-size: 16px;">📭 No submissions yet</p>
                    <p style="font-size: 14px; margin-top: 10px;">Be the first to join the early access list!</p>
                </div>
            `;
            dataDisplay.style.display = 'none';
            return;
        }
        
        // Show data display
        dataDisplay.style.display = 'block';
        
        // Build HTML
        let html = '<div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">';
        
        data.forEach((item, index) => {
            const displayDate = item.displayDate || formatDateForDisplay(item.birthDay, item.birthMonth, item.birthYear);
            
            html += `
                <div class="submission-item">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #4c51bf;">${item.name}</h4>
                            <p style="margin: 0; color: #718096; font-size: 14px;">${item.email}</p>
                        </div>
                        <span style="background: #e2e8f0; color: #4a5568; padding: 3px 8px; border-radius: 12px; font-size: 12px;">
                            #${index + 1}
                        </span>
                    </div>
                    
                    <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 14px;">
                        <span style="color: #4a5568;">
                            <strong>📅:</strong> ${displayDate}
                        </span>
                        ${item.phone ? `<span style="color: #4a5568;"><strong>📞:</strong> ${item.phone}</span>` : ''}
                        <span style="color: #4a5568;">
                            <strong>🎯:</strong> ${item.interest}
                        </span>
                    </div>
                    
                    <div style="margin-top: 8px; color: #a0aec0; font-size: 12px;">
                        Submitted: ${item.timestamp}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        submissionsList.innerHTML = html;
        
        console.log(`✅ Displayed ${data.length} submissions`);
        
    } catch (error) {
        console.error('❌ Error displaying data:', error);
        submissionsList.innerHTML = `
            <div style="color: #e53e3e; text-align: center; padding: 20px;">
                Error loading data. Please refresh the page.
            </div>
        `;
    }
}

// ==========================================
// USER MANAGEMENT
// ==========================================

function checkExistingUser() {
    const savedEmail = localStorage.getItem('shivaNetraUserEmail');
    if (savedEmail) {
        console.log('Welcome back:', savedEmail);
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.style.display = 'block';
        }
    }
}

// ==========================================
// UI HELPERS
// ==========================================

function showLoading(show, message = 'Processing...') {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
        const text = loader.querySelector('.loader-text');
        if (text) text.textContent = message;
    }
}

// Clear all data
function clearAllData() {
    if (confirm('⚠️ Are you sure you want to delete ALL data? This cannot be undone!')) {
        localStorage.removeItem('shivaNetraSubmissions');
        localStorage.removeItem('shivaNetraUserEmail');
        localStorage.removeItem('shivaNetraUserName');
        localStorage.removeItem('shivaNetraLastSubmission');
        
        alert('✅ All data cleared successfully!');
        location.reload();
    }
}

// Make function global
window.clearAllData = clearAllData;

// ==========================================
// DEBUG TOOLS
// ==========================================

function setupDebugTools() {
    window.debugShiva = {
        // View all data
        viewData: function() {
            const data = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
            console.log('📊 All data:', data);
            console.log('Total:', data.length);
            return data;
        },
        
        // Add test data
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
            loadAndDisplayData();
            alert('✅ Test data added!');
        },
        
        // Check storage
        checkStorage: function() {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i));
            }
            console.log('🗃️ LocalStorage keys:', keys);
            return keys;
        }
    };
    
    console.log('🔧 Debug tools available. Use: debugShiva.viewData()');
}

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================

console.log('✨ Shiva Netra Lite ready!');
