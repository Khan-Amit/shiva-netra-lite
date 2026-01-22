// ===== SHIVA NETRA LITE - PUBLIC VERSION =====
// Contains only basic, non-proprietary algorithms
// Advanced features reserved for Pro version

// ===== APP STATE =====
let userData = {
    name: '',
    birthDate: '',
    lastReading: null,
    lastForecast: null
};

// ===== DOM ELEMENTS =====
const elements = {
    // Calculator elements
    userName: document.getElementById('userName'),
    birthDay: document.getElementById('birthDay'),
    birthMonth: document.getElementById('birthMonth'),
    birthYear: document.getElementById('birthYear'),
    calculateBtn: document.getElementById('calculateBtn'),
    startReadingBtn: document.getElementById('startReadingBtn'),
    
    // Daily Forecast elements
    dayStars: document.getElementById('dayStars'),
    dayRatingText: document.getElementById('dayRatingText'),
    energyLevel: document.getElementById('energyLevel'),
    moneyLuck: document.getElementById('moneyLuck'),
    loveEnergy: document.getElementById('loveEnergy'),
    warningsList: document.getElementById('warningsList'),
    travelAdvice: document.getElementById('travelAdvice'),
    socialAdvice: document.getElementById('socialAdvice'),
    weatherVibe: document.getElementById('weatherVibe'),
    luckyColor: document.getElementById('luckyColor'),
    luckyTime: document.getElementById('luckyTime'),
    luckyFood: document.getElementById('luckyFood'),
    luckyDirection: document.getElementById('luckyDirection'),
    refreshForecastBtn: document.getElementById('refreshForecastBtn'),
    
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
    aboutBtn: document.getElementById('aboutBtn')
};

// ===== DAILY FORECAST SYSTEM =====
const dailyForecastSystem = {
    // Forecast databases
    dayRatings: [
        { stars: 5, text: "Excellent Day! ✨", color: "#10B981" },
        { stars: 4, text: "Very Good Day! 👍", color: "#34D399" },
        { stars: 3, text: "Average Day 📊", color: "#FBBF24" },
        { stars: 2, text: "Challenging Day ⚠️", color: "#F59E0B" },
        { stars: 1, text: "Difficult Day 💪", color: "#EF4444" }
    ],
    
    energyLevels: ["Very High ⚡", "High 🔥", "Medium ⚖️", "Low 🌙", "Very Low 😴"],
    
    moneyLuck: ["Excellent 💰", "Very Good 💵", "Good 💲", "Average 💸", "Poor 💔", "Avoid Spending 🚫"],
    loveEnergy: ["Passionate ❤️‍🔥", "Romantic 💕", "Stable 💑", "Challenging 💔", "Avoid Conflicts ⚠️", "Focus on Self 🧘"],
    
    warnings: [
        "Be careful of minor injuries",
        "Avoid lending money today",
        "Think before speaking in meetings",
        "Watch your step on stairs",
        "Double-check important documents",
        "Avoid risky investments",
        "Be cautious while driving",
        "Don't make promises you can't keep",
        "Protect your electronic devices",
        "Avoid heated arguments",
        "Check weather before travel",
        "Be careful with electricity",
        "Avoid crowded places",
        "Drink plenty of water",
        "Get enough sleep tonight"
    ],
    
    travelAdvice: [
        "Excellent for travel ✈️",
        "Good for short trips 🚗",
        "Avoid long journeys 🚫",
        "Stay local today 🏡",
        "Perfect for adventure 🗺️",
        "Be cautious while traveling ⚠️"
    ],
    
    socialAdvice: [
        "Great for meeting new people 👥",
        "Meet new people cautiously 🤝",
        "Avoid large gatherings 🚫",
        "Focus on close friends 👫",
        "Excellent for networking 💼",
        "Be selective with conversations 💬"
    ],
    
    weatherVibes: [
        "Sunny and positive ☀️",
        "Partly cloudy emotions ⛅",
        "Stormy emotions ahead ⛈️",
        "Clear and peaceful 🌤️",
        "Foggy intuition 🌫️",
        "Rainy but refreshing 🌧️",
        "Windy changes ahead 💨",
        "Calm and stable 🌅"
    ],
    
    luckyColors: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡", "Purple 🟣", "White ⚪", "Black ⚫", "Gold 🟡", "Silver ⚪"],
    luckyTimes: ["Morning 🌅", "Afternoon ☀️", "Evening 🌇", "Night 🌙", "9-11 AM", "2-4 PM", "6-8 PM", "Midnight 🌌"],
    luckyFoods: ["Spicy 🌶️", "Sweet 🍭", "Sour 🍋", "Bitter 🍫", "Salty 🧂", "Fresh fruits 🍎", "Green vegetables 🥦", "Protein 🍗"],
    luckyDirections: ["North 🧭", "South 🧭", "East 🧭", "West 🧭", "Northeast 🧭", "Northwest 🧭", "Southeast 🧭", "Southwest 🧭"],
    
    // Generate daily forecast (same for all users today, changes daily)
    generateDailyForecast() {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
        
        // Consistent random based on date
        const random = (min, max) => {
            return Math.floor((Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;
        };
        
        const ratingIndex = random(0, this.dayRatings.length - 1);
        const energyIndex = random(0, this.energyLevels.length - 1);
        const moneyIndex = random(0, this.moneyLuck.length - 1);
        const loveIndex = random(0, this.loveEnergy.length - 1);
        
        // Generate 3 unique warnings
        const warnings = [];
        while (warnings.length < 3) {
            const warning = this.warnings[random(0, this.warnings.length - 1)];
            if (!warnings.includes(warning)) {
                warnings.push(warning);
            }
        }
        
        return {
            rating: this.dayRatings[ratingIndex],
            energy: this.energyLevels[energyIndex],
            moneyLuck: this.moneyLuck[moneyIndex],
            loveEnergy: this.loveEnergy[loveIndex],
            warnings: warnings,
            travel: this.travelAdvice[random(0, this.travelAdvice.length - 1)],
            social: this.socialAdvice[random(0, this.socialAdvice.length - 1)],
            weather: this.weatherVibes[random(0, this.weatherVibes.length - 1)],
            luckyColor: this.luckyColors[random(0, this.luckyColors.length - 1)],
            luckyTime: this.luckyTimes[random(0, this.luckyTimes.length - 1)],
            luckyFood: this.luckyFoods[random(0, this.luckyFoods.length - 1)],
            luckyDirection: this.luckyDirections[random(0, this.luckyDirections.length - 1)]
        };
    },
    
    // Update forecast display
    updateForecastDisplay(forecast) {
        // Rating stars
        elements.dayStars.innerHTML = '';
        for (let i = 0; i < forecast.rating.stars; i++) {
            const star = document.createElement('i');
            star.className = 'fas fa-star';
            elements.dayStars.appendChild(star);
        }
        
        // Rating text
        elements.dayRatingText.textContent = forecast.rating.text;
        elements.dayRatingText.style.color = forecast.rating.color;
        
        // Energy and luck
        elements.energyLevel.textContent = forecast.energy;
        elements.moneyLuck.textContent = forecast.moneyLuck;
        elements.loveEnergy.textContent = forecast.loveEnergy;
        
        // Warnings
        elements.warningsList.innerHTML = '';
        forecast.warnings.forEach(warning => {
            const li = document.createElement('li');
            li.textContent = warning;
            elements.warningsList.appendChild(li);
        });
        
        // Advice
        elements.travelAdvice.textContent = forecast.travel;
        elements.socialAdvice.textContent = forecast.social;
        elements.weatherVibe.textContent = forecast.weather;
        
        // Lucky elements
        elements.luckyColor.textContent = forecast.luckyColor;
        elements.luckyTime.textContent = forecast.luckyTime;
        elements.luckyFood.textContent = forecast.luckyFood;
        elements.luckyDirection.textContent = forecast.luckyDirection;
        
        // Save forecast
        userData.lastForecast = {
            ...forecast,
            generatedAt: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('shivaNetraLite_lastForecast', JSON.stringify(userData.lastForecast));
        } catch (e) {
            // Ignore storage errors
        }
    }
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
            `Your Life Path ${lifePath} and Destiny ${destiny} suggest a journey of self-discovery. The combination indicates potential for spiritual growth and personal development.`,
            `With Life Path ${lifePath} and Destiny ${destiny}, you have unique gifts to share with the world. This pairing suggests creativity balanced with practicality.`,
            `The combination of ${lifePath} and ${destiny} indicates potential for spiritual growth. You're here to learn important life lessons and share wisdom.`,
            `Your numbers ${lifePath} and ${destiny} work together to guide your life purpose. Life Path provides your core energy, while Destiny shows your potential.`,
            `Life Path ${lifePath} gives you your foundational traits, while Destiny ${destiny} points to your ultimate purpose. Together they create your unique spiritual blueprint.`
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

// ===== DATE DROPDOWN FUNCTIONS =====
function initializeDateDropdowns() {
    // Fill days (1-31)
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        elements.birthDay.appendChild(option);
    }
    
    // Fill years (1900 to current year)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        elements.birthYear.appendChild(option);
    }
    
    // Set current date as default
    const today = new Date();
    elements.birthDay.value = today.getDate();
    elements.birthMonth.value = today.getMonth() + 1;
    elements.birthYear.value = today.getFullYear() - 30; // Default to 30 years ago
    
    // Quick year buttons
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const decade = parseInt(this.dataset.decade);
            const yearOptions = Array.from(elements.birthYear.options).map(opt => parseInt(opt.value));
            const closestYear = yearOptions.reduce((prev, curr) => {
                return (Math.abs(curr - decade) < Math.abs(prev - decade) ? curr : prev);
            });
            
            elements.birthYear.value = closestYear;
            showToast(`Set to ${closestYear}`, 2000);
        });
    });
}

function getBirthDateFromDropdowns() {
    const day = elements.birthDay.value;
    const month = elements.birthMonth.value;
    const year = elements.birthYear.value;
    
    if (!day || !month || !year) {
        return '';
    }
    
    // Format as YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
    const birthDate = getBirthDateFromDropdowns();
    
    if (!name) {
        showToast("Please enter your name", 2000);
        elements.userName.focus();
        return;
    }
    
    if (!birthDate) {
        showToast("Please select your complete birth date", 2000);
        return;
    }
    
    // Validate birth date (not in future)
    const today = new Date();
    const selectedDate = new Date(birthDate);
    if (selectedDate > today) {
        showToast("Birth date cannot be in the future", 2000);
        return;
    }
    
    // Validate reasonable age (not older than 150)
    const age = today.getFullYear() - selectedDate.getFullYear();
    if (age > 150) {
        showToast("Please enter a valid birth date", 2000);
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

// Refresh Forecast Button
elements.refreshForecastBtn.addEventListener('click', function() {
    const forecast = dailyForecastSystem.generateDailyForecast();
    dailyForecastSystem.updateForecastDisplay(forecast);
    showToast("Forecast refreshed! New insights generated. ✨", 2000);
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
• Danger alerts and warnings
• Hour-by-hour daily forecasts
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
    showModal(`Shiva Netra Lite - Free Numerology & Daily Forecasts

This is a limited free version of Shiva Netra, designed to give you daily spiritual guidance and basic numerology insights.

What's included in Lite:
• Daily cosmic forecasts with warnings
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
• Personalized danger alerts
• Hour-by-hour forecasts
• Priority support

All advanced algorithms and proprietary systems are protected intellectual property.

For inquiries: Contact via waitlist form.`);
});

// ===== INITIALIZATION =====
function init() {
    // Initialize date dropdowns
    initializeDateDropdowns();
    
    // Generate and display daily forecast
    try {
        const savedForecast = localStorage.getItem('shivaNetraLite_lastForecast');
        const today = new Date();
        const savedDate = savedForecast ? new Date(JSON.parse(savedForecast).generatedAt) : null;
        
        // Use saved forecast if it's from today, otherwise generate new
        if (savedForecast && savedDate && savedDate.toDateString() === today.toDateString()) {
            dailyForecastSystem.updateForecastDisplay(JSON.parse(savedForecast));
        } else {
            const forecast = dailyForecastSystem.generateDailyForecast();
            dailyForecastSystem.updateForecastDisplay(forecast);
        }
    } catch (e) {
        const forecast = dailyForecastSystem.generateDailyForecast();
        dailyForecastSystem.updateForecastDisplay(forecast);
    }
    
    // Load last reading if exists
    try {
        const savedReading = localStorage.getItem('shivaNetraLite_lastReading');
        if (savedReading) {
            userData.lastReading = JSON.parse(savedReading);
        }
    } catch (e) {
        // Local storage not available, ignore
    }
    
    // Set initial affirmation
    elements.affirmationText.textContent = getRandomAffirmation();
    
    // Welcome message after delay
    setTimeout(() => {
        showToast("Welcome to Shiva Netra Lite! Check your daily forecast above. ✨", 4000);
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
