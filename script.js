// Shiva Netra Lite - Simple Working Version
console.log('Shiva Netra Lite loaded!');

// When page loads
window.onload = function() {
    console.log('Page loaded successfully');
    
    // Fill birth years (1900-current year)
    fillBirthYears();
    
    // Setup form
    setupForm();
    
    // Show existing data
    showData();
};

// Fill birth year dropdown
function fillBirthYears() {
    const select = document.getElementById('birthYear');
    if (!select) return;
    
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    
    // Clear existing options (keep first one)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add years
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
    }
    
    console.log('Birth years filled:', currentYear - startYear + 1, 'years');
}

// Setup form submission
function setupForm() {
    const form = document.getElementById('earlyAccessForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    form.onsubmit = function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        // Get values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const birthYear = document.getElementById('birthYear').value;
        
        // Validate
        if (!name || !email) {
            alert('Please enter name and email');
            return false;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email');
            return false;
        }
        
        // Create data object
        const data = {
            name: name,
            email: email,
            birthYear: birthYear || 'Not provided',
            timestamp: new Date().toLocaleString(),
            date: new Date().toISOString()
        };
        
        console.log('Data to save:', data);
        
        // Save to localStorage
        saveData(data);
        
        // Show success
        alert('✅ Thank you ' + name + '!\n\nYou are now on the Shiva Netra Lite early access list.');
        
        // Reset form
        form.reset();
        
        // Show updated data
        showData();
        
        return false;
    };
}

// Save data to localStorage
function saveData(newData) {
    // Get existing data
    let allData = JSON.parse(localStorage.getItem('shivaData') || '[]');
    
    // Add new data at beginning
    allData.unshift(newData);
    
    // Keep only last 100 entries
    if (allData.length > 100) {
        allData = allData.slice(0, 100);
    }
    
    // Save back
    localStorage.setItem('shivaData', JSON.stringify(allData));
    
    console.log('Data saved. Total entries:', allData.length);
}

// Display data on page
function showData() {
    const output = document.getElementById('dataOutput');
    if (!output) return;
    
    // Get data
    const data = JSON.parse(localStorage.getItem('shivaData') || '[]');
    
    if (data.length === 0) {
        output.innerHTML = '<p style="color:#666;">No data yet. Submit the form above.</p>';
        return;
    }
    
    // Build HTML
    let html = '<p style="color:#333;font-weight:bold;">Total entries: ' + data.length + '</p>';
    
    data.forEach((item, index) => {
        html += `
            <div class="data-item">
                <strong>${index + 1}. ${item.name}</strong><br>
                <small>Email: ${item.email}</small><br>
                <small>Year: ${item.birthYear}</small><br>
                <small style="color:#888;">${item.timestamp}</small>
            </div>
        `;
    });
    
    output.innerHTML = html;
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to delete ALL data?')) {
        localStorage.removeItem('shivaData');
        showData();
        alert('All data cleared!');
    }
}

// Make function globally available
window.clearAllData = clearAllData;

console.log('Shiva Netra Lite ready! Use clearAllData() to reset.');
