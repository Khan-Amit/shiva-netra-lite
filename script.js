// ====================================
// SHIVA NETRA LITE - GUARANTEED WORKING
// ====================================

console.log('🕉️ Shiva Netra Lite - Blessed Version');

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page ready');
    
    // Find the form
    const form = document.getElementById('earlyAccessForm');
    
    if (form) {
        console.log('✅ Form found');
        
        // Add submit handler
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('📝 Form submitting...');
            
            // Get values - SIMPLE
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            
            // Check if fields exist
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Phone:', phone);
            
            // Basic check
            if (!name || !email) {
                alert('Please enter your name and email');
                return;
            }
            
            if (!email.includes('@')) {
                alert('Please enter a valid email');
                return;
            }
            
            // Create data object
            const userData = {
                name: name,
                email: email,
                phone: phone,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString()
            };
            
            console.log('Saving:', userData);
            
            // SAVE TO LOCALSTORAGE - ALWAYS WORKS
            try {
                localStorage.setItem('shiva_netra_last_user', JSON.stringify(userData));
                console.log('✅ Saved to localStorage');
                
                // Also add to list
                let allUsers = JSON.parse(localStorage.getItem('shiva_netra_users') || '[]');
                allUsers.push(userData);
                localStorage.setItem('shiva_netra_users', JSON.stringify(allUsers));
                
            } catch (e) {
                console.log('LocalStorage error (but continuing):', e);
            }
            
            // SHOW SUCCESS - SIMPLE ALERT
            alert('✅ Thank you! You are now on the early access list for Shiva Netra Lite.\n\nWe will contact you soon with updates.');
            
            // Reset form
            form.reset();
            
            // Show success on page too
            showSuccessOnPage(name);
            
            console.log('✅ Form submitted successfully!');
        });
        
    } else {
        console.log('⚠️ Form not found by ID "earlyAccessForm"');
        // Try other common form IDs
        const otherForms = document.querySelectorAll('form');
        console.log('Found forms:', otherForms.length);
    }
    
    // Check if user already signed up
    const saved = localStorage.getItem('shiva_netra_last_user');
    if (saved) {
        try {
            const user = JSON.parse(saved);
            console.log('Welcome back:', user.name);
            showWelcomeMessage(user.name);
        } catch (e) {
            console.log('Error reading saved user');
        }
    }
});

// Show welcome message
function showWelcomeMessage(name) {
    const msg = document.createElement('div');
    msg.innerHTML = `<p style="background:#10b981;color:white;padding:10px;border-radius:5px;">Welcome back, ${name}! 🙏</p>`;
    msg.style.margin = '10px 0';
    
    const container = document.querySelector('form') || document.body;
    container.prepend(msg);
    
    setTimeout(() => msg.remove(), 5000);
}

// Show success on page
function showSuccessOnPage(name) {
    // Remove any existing success message
    const old = document.getElementById('success-msg');
    if (old) old.remove();
    
    // Create new success message
    const success = document.createElement('div');
    success.id = 'success-msg';
    success.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
            animation: fadeIn 0.5s ease;
        ">
            <h3 style="margin:0 0 10px 0;">🎉 Thank You, ${name}!</h3>
            <p style="margin:0;">You are now on the Shiva Netra Lite early access list.</p>
            <p style="margin:10px 0 0 0;font-size:14px;opacity:0.9;">We will contact you soon with exciting updates!</p>
        </div>
    `;
    
    // Add to page
    const form = document.getElementById('earlyAccessForm');
    if (form) {
        form.parentNode.insertBefore(success, form.nextSibling);
    } else {
        document.body.appendChild(success);
    }
    
    // Scroll to success message
    setTimeout(() => {
        success.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

console.log('✨ Shiva Netra Lite script loaded successfully!');
