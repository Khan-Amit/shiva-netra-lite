// Shiva Netra Lite - ULTRA SIMPLE WORKING VERSION
console.log('🚀 Shiva Netra - Loading...');

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded');
    
    // Show alert with current data count
    const data = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
    console.log('Current data count:', data.length);
    
    // Populate birth years
    const birthYearSelect = document.getElementById('birthYear');
    if (birthYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1900; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            birthYearSelect.appendChild(option);
        }
    }
    
    // Handle form submission
    const form = document.getElementById('earlyAccessForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone')?.value.trim() || '',
                birthYear: document.getElementById('birthYear')?.value || '',
                interest: document.getElementById('interest')?.value || 'general',
                timestamp: new Date().toLocaleString(),
                id: Date.now()
            };
            
            console.log('Submitting:', formData);
            
            // Validate
            if (!formData.name || !formData.email) {
                alert('Please enter name and email');
                return;
            }
            
            if (!formData.email.includes('@')) {
                alert('Please enter valid email');
                return;
            }
            
            // Save to LocalStorage
            saveData(formData);
            
            // Show success
            alert('✅ Thank you ' + formData.name + '! You are on the early access list.');
            
            // Reset form
            form.reset();
            
            // Show data on page
            displayData();
        });
    }
    
    // Display existing data
    displayData();
});

// Save data
function saveData(data) {
    let allData = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
    allData.unshift(data); // Add to beginning
    
    // Keep only last 50
    if (allData.length > 50) {
        allData = allData.slice(0, 50);
    }
    
    localStorage.setItem('shivaNetraSubmissions', JSON.stringify(allData));
    console.log('Data saved. Total:', allData.length);
}

// Display data ON PAGE
function displayData() {
    const data = JSON.parse(localStorage.getItem('shivaNetraSubmissions') || '[]');
    
    // Create or find display area
    let displayArea = document.getElementById('dataDisplayArea');
    
    if (!displayArea) {
        displayArea = document.createElement('div');
        displayArea.id = 'dataDisplayArea';
        displayArea.style.cssText = `
            background: white;
            padding: 20px;
            margin-top: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        `;
        
        // Add to page (after form or at bottom)
        const form = document.getElementById('earlyAccessForm');
        if (form) {
            form.parentNode.insertBefore(displayArea, form.nextSibling);
        } else {
            document.body.appendChild(displayArea);
        }
    }
    
    if (data.length === 0) {
        displayArea.innerHTML = '<p style="color:#666;text-align:center;">No submissions yet. Be the first!</p>';
        return;
    }
    
    // Build HTML
    let html = '<h3 style="color:#4c51bf;margin-top:0;">📊 Recent Submissions</h3>';
    
    data.forEach(item => {
        html += `
            <div style="border-left:4px solid #667eea;padding:10px 15px;margin:10px 0;background:#f9fafb;">
                <div style="font-weight:bold;color:#333;">${item.name}</div>
                <div style="color:#666;font-size:14px;">Email: ${item.email}</div>
                <div style="color:#666;font-size:14px;">Year: ${item.birthYear || 'Not provided'}</div>
                <div style="color:#888;font-size:12px;margin-top:5px;">${item.timestamp}</div>
            </div>
        `;
    });
    
    html += `<p style="text-align:center;color:#666;">Total: ${data.length} submission(s)</p>`;
    html += '<button onclick="clearAllData()" style="background:#ef4444;color:white;border:none;padding:8px 16px;border-radius:5px;cursor:pointer;">Clear All Data</button>';
    
    displayArea.innerHTML = html;
}

// Clear data function
function clearAllData() {
    if (confirm('Clear all saved data?')) {
        localStorage.removeItem('shivaNetraSubmissions');
        displayData();
        alert('Data cleared!');
    }
}

// Make function global
window.clearAllData = clearAllData;

console.log('✅ Shiva Netra ready! Use clearAllData() to reset.');
