// ===== SHIVA NETRA LITE - PUBLIC VERSION =====
// Contains only basic, non-proprietary algorithms
// Advanced features reserved for Pro version

// ===== APP STATE =====
let userData = {
    name: '',
    birthDate: '',
    lastReading: null
};

// ===== DOM ELEMENTS =====
const elements = {
    // Calculator elements
    userName: document.getElementById('userName'),
    birthDate: document.getElementById('birthDate'),
    calculateBtn: document.getElementById('calculateBtn'),
    startReadingBtn: document.getElementById('startReadingBtn'),
    
    // Results elements
    calculatorCard: document.getElementById('calculatorCard'),
    resultsCard: document.getElementById('resultsCard'),
    lifePathValue: document.getElementById('lifePathValue'),
    lifePathDesc: document.getElementById('lifePathDesc'),
    destinyValue: document.getElementById('destinyValue'),
    destinyDesc: document.getElementById('destinyDesc'),
    basicInterpretation: document.getElementById('basicInterpretation'),
    
    // Affirmation elements
    affirmationText: document.getElementById('affirmationText'),
    newAffirmationBtn: document.getElementById('newAffirmationBtn'),
    speakAffirmationBtn: document.getElementById('speakAffirmationBtn'),
    copyAffirmationBtn: document.getElementById('copyAffirmationBtn'),
    
    // Waitlist elements
    waitlistForm: document.getElementById('waitlistForm'),
    waitlistName: document.getElementById('waitlistName'),
    waitlistEmail: document.getElementById('waitlistEmail'),
    interestLevel: document.getElementById('interestLevel'),
    privacyConsent: document.getElementById('privacyConsent'),
    
    // UI elements
    toast: document.getElementById('toast'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    simpleModal: document.getElementById('simpleModal'),
    modalMessage: document.getElementById('modalMessage'),
    modalClose: document.querySelector('.modal-close'),
    aboutBtn: document.getElementById('aboutBtn'),
    privacyBtn: document.getElementById('privacyBtn')
};

// ===== BASIC NUMEROLOGY ALGORITHMS (PUBLIC DOMAIN) =====
const numerologyLite = {
    // Basic Life Path Number (from birth date only)
    calculateLifePath: function(birthDate) {
        if (!birthDate) return this.getRandomNumber(1, 9);
        
        try {
            const date = new Date(birthDate);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            
            // Sum all digits
            const sum = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(year);
            
            // Reduce to single digit
            return this.reduceToSingleDigit(sum);
        } catch (error) {
            console.error('Error calculating life path:', error);
            return this.getRandomNumber(1, 9);
        }
    },
    
    // Basic Destiny Number (simple name calculation)
    calculateDestiny: function(fullName) {
        if (!fullName || fullName.trim() === '') return this.getRandomNumber(1, 9);
        
        const name = fullName.toLowerCase().replace(/[^a-z\s]/g, '');
        let sum = 0;
        
        // Very basic calculation - not the proprietary algorithm
        for (let i = 0; i < name.length; i++) {
            const char = name.charAt(i);
            if (char >= 'a' && char <= 'z') {
                // Simple alphabetical position (a=1, b=2, etc.)
                sum += char.charCodeAt(0) - 96;
            }
        }
        
        return this.reduceToSingleDigit(sum);
    },
    
    // Helper: Sum digits of a number
    sumDigits: function(num) {
        let sum = 0;
        while (num > 0) {
            sum += num % 10;
            num = Math.floor(num / 10);
        }
        return sum;
    },
    
    // Helper: Reduce to single digit (standard numerology method)
    reduceToSingleDigit: function(num) {
        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = this.sumDigits(num);
        }
        return num;
    },
    
    // Get random number (for fallback)
    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Basic interpretations (public domain meanings)
    getNumberMeaning: function(number) {
        const meanings = {
            1: { title: "The Leader", desc: "Independent, creative, pioneering" },
            2: { title: "The Diplomat", desc: "Cooperative, intuitive, peaceful" },
            3: { title: "The Creator", desc: "Expressive, joyful, communicative" },
            4: { title: "The Builder", desc: "Practical, disciplined, stable" },
            5: { title: "The Freedom Seeker", desc: "Adventurous, versatile, progressive" },
            6: { title: "The Nurturer", desc: "Responsible, compassionate, healing" },
            7: { title: "The Seeker", desc: "Analytical, intuitive, spiritual" },
            8: { title: "The Achiever", desc: "Ambitious, authoritative, successful" },
            9: { title: "The Humanitarian", desc: "Compassionate, artistic, wise" },
            11: { title: "The Intuitive", desc: "Inspirational, idealistic, visionary" },
            22: { title: "The Master Builder", desc: "Practical visionary, powerful" },
            33: { title: "The Master Teacher", desc: "Healing, blessing, uplifting" }
        };
        
        return meanings[number] || meanings[1];
    },
    
    // Generate basic interpretation
    generateBasicInterpretation: function(lifePath, destiny) {
        const interpretations = [
            `Your Life Path ${lifePath} and Destiny ${destiny} suggest a journey of self-discovery.`,
            `With Life Path ${lifePath} and Destiny ${destiny}, you have unique gifts to share with the world.`,
            `The combination of ${lifePath} and ${destiny} indicates potential for spiritual growth.`,
            `Your numbers ${lifePath} and ${destiny} work together to guide your life purpose.`,
            `Life Path ${lifePath} provides your core energy, while Destiny ${destiny} shows your potential.`
        ];
        
        const randomIndex = Math.floor(Math.random() * interpretations.length);
        return interpretations[randomIndex];
    }
};

// ===== DAILY AFFIRMATIONS =====
const affirmations = [
    "I am guided by divine wisdom in all that I do.",
    "My spiritual path unfolds perfectly before me.",
    "I trust the universe's timing in my life.",
    "Every challenge brings me closer to my true self.",
    "I am connected to infinite wisdom and love.",
    "My intuition grows stronger every day.",
    "I release what no longer serves my highest good.",
    "Peace flows through me in every moment.",
    "I am exactly where I need to be on my journey.",
    "Divine light guides and protects me always.",
    "I attract positive energy and abundance.",
    "My heart is open to receive love and blessings.",
    "I am a powerful creator of my reality.",
    "Today, I choose joy and gratitude.",
    "I am worthy of all the good that comes to me."
];

// ===== UTILITY FUNCTIONS =====
function showToast(message, duration = 3000) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, duration);
}

function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.remove('hidden');
    } else {
        elements.loadingOverlay.classList.add('hidden');
    }
}

function showModal(message) {
    elements.modalMessage.textContent = message;
    elements.simpleModal.classList.remove('hidden');
}

function getRandomAffirmation() {
    return affirmations[Math.floor(Math.random() * affirmations.length)];
}

// ===== EVENT HANDLERS =====

// Start Reading Button
elements.startReadingBtn.addEventListener('click', function() {
    document.getElementById('calculatorCard').scrollIntoView({ behavior: 'smooth' });
    elements.userName.focus();
});

// Calculate Reading
elements.calculateBtn.addEventListener('click', function() {
    const name = elements.userName.value.trim();
    const birthDate = elements.birthDate.value;
    
    if (!name) {
        showToast("Please enter your name", 2000);
        elements.userName.focus();
        return;
    }
    
    if (!birthDate) {
        showToast("Please select your birth date", 2000);
        elements.birthDate.focus();
        return;
    }
    
    // Validate birth date (not in future)
    const today = new Date();
    const selectedDate = new Date(birthDate);
    if (selectedDate > today) {
        showToast("Birth date cannot be in the future", 2000);
        return;
    }
    
    // Show loading
    showLoading(true);
    
    // Simulate calculation (for user experience)
    setTimeout(() => {
        // Calculate numbers using basic algorithms
        const lifePath = numerologyLite.calculateLifePath(birthDate);
        const destiny = numerologyLite.calculateDestiny(name);
        
        // Get meanings
        const lifePathMeaning = numerologyLite.getNumberMeaning(lifePath);
        const destinyMeaning = numerologyLite.getNumberMeaning(destiny);
        
        // Update UI
        elements.lifePathValue.textContent = lifePath;
        elements.lifePathDesc.textContent = lifePathMeaning.title;
        
        elements.destinyValue.textContent = destiny;
        elements.destinyDesc.textContent = destinyMeaning.title;
        
        // Generate interpretation
        elements.basicInterpretation.textContent = 
            numerologyLite.generateBasicInterpretation(lifePath, destiny) + 
            " For detailed analysis including personal year, month, day, karmic lessons, and personalized remedies, upgrade to Shiva Netra Pro.";
        
        // Show results
        elements.calculatorCard.classList.add('hidden');
        elements.resultsCard.classList.remove('hidden');
        
        // Save user data locally
        userData.name = name;
        userData.birthDate = birthDate;
        userData.lastReading = {
            lifePath,
            destiny,
            calculatedAt: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('shivaNetraLite_lastReading', JSON.stringify(userData.lastReading));
        } catch (e) {
            console.log('Local storage not available');
        }
        
        // Hide loading
        showLoading(false);
        
        // Scroll to results
        elements.resultsCard.scrollIntoView({ behavior: 'smooth' });
        
        showToast("Basic reading complete! Check out Pro version for detailed analysis. ✨", 4000);
    }, 1500);
});

// Affirmation Functions
elements.newAffirmationBtn.addEventListener('click', function() {
    elements.affirmationText.textContent = getRandomAffirmation();
    showToast("New affirmation received", 2000);
});

elements.speakAffirmationBtn.addEventListener('click', function() {
    if ('speechSynthesis' in navigator) {
        const utterance = new SpeechSynthesisUtterance(elements.affirmationText.textContent);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to get a nice voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
        );
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
        showToast("Speaking affirmation...", 2000);
    } else {
        showToast("Voice synthesis not supported in your browser", 2000);
    }
});

elements.copyAffirmationBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(elements.affirmationText.textContent)
        .then(() => showToast("Affirmation copied to clipboard! 📋", 2000))
        .catch(() => showToast("Failed to copy", 2000));
});

// Waitlist Form
elements.waitlistForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!elements.privacyConsent.checked) {
        showToast("Please agree to receive updates", 2000);
        return;
    }
    
    const formData = {
        name: elements.waitlistName.value.trim(),
        email: elements.waitlistEmail.value.trim(),
        interest: elements.interestLevel.value,
        timestamp: new Date().toISOString(),
        source: 'Shiva Netra Lite Website'
    };
    
    // For now, we'll just show a success message
    // In production, you would send this to your backend
    showLoading(true);
    
    setTimeout(() => {
        // Simulate API call
        console.log('Waitlist submission:', formData);
        
        // Show success
        showLoading(false);
        
        // Reset form
        elements.waitlistForm.reset();
        
        // Show success modal
        showModal(`Thank you ${formData.name}! You've been added to the Shiva Netra Pro waitlist. 
        
We'll notify you when the Pro version launches with:
• Advanced numerology algorithms
• Personalized remedies
• Detailed compatibility reports
• And much more!

You'll receive early access and special pricing.`);
        
        // Log to console for demo purposes
        console.log('Demo: Email would be sent to:', formData.email);
    }, 1000);
});

// Modal Close
elements.modalClose.addEventListener('click', function() {
    elements.simpleModal.classList.add('hidden');
});

// Close modal when clicking outside
elements.simpleModal.addEventListener('click', function(e) {
    if (e.target === elements.simpleModal) {
        elements.simpleModal.classList.add('hidden');
    }
});

// About Button
elements.aboutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showModal(`Shiva Netra Lite - Free Basic Numerology

This is a limited free version of Shiva Netra, designed to give you a glimpse of spiritual numerology guidance.

What's included in Lite:
• Basic Life Path calculation
• Simple Destiny number
• Daily affirmations
• Free forever

What's in Shiva Netra Pro (Coming Soon):
• 15+ detailed numerology numbers
• Personalized remedies & mantras
• Compatibility analysis
• Progress tracking
• Detailed PDF reports
• Priority support

All advanced algorithms and proprietary systems are protected intellectual property.

For inquiries: Contact via waitlist form.`);
});

// Privacy Button
elements.privacyBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showModal(`Privacy Notice - Shiva Netra Lite

Data Collection:
• This Lite version stores NO personal data on servers
• All calculations happen in your browser
• We use local storage only (on your device)
• No tracking or analytics

Waitlist Data:
• If you join the waitlist, we collect only name and email
• Used solely to notify about Pro version launch
• Never shared with third parties
• You can unsubscribe anytime

Pro Version (Coming Soon):
• Will have encrypted cloud storage
• Optional data saving for progress tracking
• GDPR compliant
• Transparent data policies

For questions: Use waitlist form to contact us.`);
});

// ===== INITIALIZATION =====
function init() {
    // Set today's date as default in birth date field
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    elements.birthDate.value = formattedDate;
    
    // Set max date to today
    elements.birthDate.max = formattedDate;
    
    // Set min date (reasonable, like 150 years ago)
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 150);
    elements.birthDate.min = minDate.toISOString().split('T')[0];
    
    // Load last reading if exists
    try {
        const savedReading = localStorage.getItem('shivaNetraLite_lastReading');
        if (savedReading) {
            userData.lastReading = JSON.parse(savedReading);
            // You could auto-show last reading here if desired
        }
    } catch (e) {
        // Local storage not available, ignore
    }
    
    // Set initial affirmation
    elements.affirmationText.textContent = getRandomAffirmation();
    
    // Welcome message after delay
    setTimeout(() => {
        showToast("Welcome to Shiva Netra Lite! Try our free basic numerology reading. ✨", 4000);
    }, 1000);
}

// ===== START THE APP =====
document.addEventListener('DOMContentLoaded', init);

// ===== PWA SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            },
            function(error) {
                console.log('Service Worker registration failed:', error);
            }
        );
    });
}
