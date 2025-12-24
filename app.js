// ==================== CONFIG ====================
const API_URL = 'http://localhost:3000/api';

// Sample Data (Fallback)
const SAMPLE_PANDITS = [
    {
        id: 1,
        name: "Pandit Ram Sharma",
        expertise: "Rudri, Sarad Expert",
        experience: 10,
        rating: 4.8,
        fee: 5000,
        image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
    },
    {
        id: 2,
        name: "Pandit Hari Acharya",
        expertise: "Griha Puja Specialist",
        experience: 7,
        rating: 4.6,
        fee: 4500,
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
        id: 3,
        name: "Pandit Krishna Joshi",
        expertise: "Sarad, Path Expert",
        experience: 12,
        rating: 4.9,
        fee: 5500,
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    {
        id: 4,
        name: "Pandit Shiva Bhattarai",
        expertise: "Bratabandha, Wedding",
        experience: 15,
        rating: 4.7,
        fee: 6000,
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    {
        id: 5,
        name: "Pandit Mohan Pandey",
        expertise: "Vedic Rituals, Hawan",
        experience: 8,
        rating: 4.5,
        fee: 4800,
        image_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400"
    },
    {
        id: 6,
        name: "Pandit Ganesh Tripathi",
        expertise: "Marriage, Engagement Ceremonies",
        experience: 20,
        rating: 4.9,
        fee: 7000,
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
    }
];

// Global State
let bookingData = null;
let selectedPandit = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadPandits();
    setMinDate();
    initBackToTop();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger animation
            menuToggle.classList.toggle('active');
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Booking Form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing! 📧');
            newsletterForm.reset();
        });
    }
    
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeLoginModal();
            closeSignupModal();
            closeSuccessModal();
        }
    });
}

// ==================== DATE SETUP ====================
function setMinDate() {
    const dateInput = document.getElementById('pujaDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// ==================== PANDITS ====================
async function loadPandits() {
    const loadingEl = document.getElementById('panditsLoading');
    const gridEl = document.getElementById('panditsGrid');
    const errorEl = document.getElementById('panditsError');
    
    try {
        // Try to fetch from backend
        const response = await fetch(`${API_URL}/pandits`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Backend not available');
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            console.log('✅ Loaded pandits from backend');
            loadingEl.style.display = 'none';
            errorEl.style.display = 'none';
            displayPandits(result.data);
            return;
        }
        
        throw new Error('No data from backend');
        
    } catch (error) {
        console.log('⚠️ Backend not available, using sample data');
        
        // Use sample data if backend fails
        loadingEl.style.display = 'none';
        errorEl.style.display = 'none';
        displayPandits(SAMPLE_PANDITS);
    }
}

function displayPandits(pandits) {
    const grid = document.getElementById('panditsGrid');
    
    if (!grid) return;
    
    if (!pandits || pandits.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--gray);">No pandits available at the moment</p>';
        return;
    }
    
    grid.innerHTML = pandits.map(pandit => `
        <div class="pandit-card" onclick="selectPandit(${pandit.id})">
            <img src="${pandit.image_url || 'https://via.placeholder.com/400x300?text=Pandit'}" 
                 alt="${pandit.name}" 
                 class="pandit-image"
                 onerror="this.src='https://via.placeholder.com/400x300?text=Pandit'">
            <div class="pandit-info">
                <h3 class="pandit-name">${pandit.name}</h3>
                <p class="pandit-specialty">${pandit.expertise}</p>
                <div class="pandit-meta">
                    <span class="pandit-rating">⭐ ${pandit.rating}</span>
                    <span class="pandit-exp">${pandit.experience} years</span>
                </div>
                <p class="pandit-fee">रु ${pandit.fee.toLocaleString()}</p>
                <button class="book-pandit-btn" onclick="event.stopPropagation(); selectPandit(${pandit.id})">
                    Book Pandit
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== BOOKING FORM ====================
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formLoader = document.getElementById('formLoader');
    const submitBtn = e.target.querySelector('.submit-btn');
    
    // Get form data
    bookingData = {
        pujaType: document.getElementById('pujaType').value,
        pujaDate: document.getElementById('pujaDate').value,
        pujaTime: document.getElementById('pujaTime').value,
        location: document.getElementById('location').value,
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        notes: document.getElementById('notes').value
    };
    
    // Show loading
    if (formLoader) formLoader.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
        if (formLoader) formLoader.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        
        // Show success and scroll to pandits
        showNotification('✅ Form submitted! कृपया एउटा pandit छान्नुहोस्', 'success');
        scrollToSection('pandits');
    }, 800);
}

// ==================== SELECT PANDIT ====================
async function selectPandit(panditId) {
    if (!bookingData) {
        showNotification('⚠️ कृपया पहिले booking form भर्नुहोस्!', 'warning');
        scrollToSection('booking');
        return;
    }
    
    try {
        // Try backend first
        const response = await fetch(`${API_URL}/pandits/${panditId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            selectedPandit = result.data;
            showBookingModal();
            return;
        }
    } catch (error) {
        console.log('Using sample data for pandit');
    }
    
    // Fallback to sample data
    selectedPandit = SAMPLE_PANDITS.find(p => p.id === panditId);
    
    if (selectedPandit) {
        showBookingModal();
    } else {
        showNotification('❌ Pandit not found', 'error');
    }
}

// ==================== MODAL ====================
function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody || !selectedPandit) return;
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--secondary); margin-bottom: 1rem; font-size: 1.3rem;">
                📋 Booking Summary
            </h3>
            <div style="background: var(--light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin-bottom: 0.8rem;"><strong>Pandit:</strong> ${selectedPandit.name}</p>
                <p style="margin-bottom: 0.8rem;"><strong>Expertise:</strong> ${selectedPandit.expertise}</p>
                <p style="margin-bottom: 0.8rem;"><strong>Rating:</strong> ⭐ ${selectedPandit.rating} (${selectedPandit.experience} years exp)</p>
            </div>
            
            <div style="background: var(--light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin-bottom: 0.8rem;"><strong>Puja Type:</strong> ${bookingData.pujaType}</p>
                <p style="margin-bottom: 0.8rem;"><strong>Date:</strong> ${formatDate(bookingData.pujaDate)}</p>
                <p style="margin-bottom: 0.8rem;"><strong>Time:</strong> ${formatTime(bookingData.pujaTime)}</p>
                <p style="margin-bottom: 0.8rem;"><strong>Location:</strong> ${bookingData.location}</p>
            </div>
            
            <div style="background: var(--light); padding: 1.5rem; border-radius: 8px;">
                <p style="margin-bottom: 0.8rem;"><strong>Your Name:</strong> ${bookingData.customerName}</p>
                <p style="margin-bottom: 0.8rem;"><strong>Phone:</strong> ${bookingData.customerPhone}</p>
                ${bookingData.notes ? `<p style="margin-bottom: 0.8rem;"><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
            </div>
            
            <hr style="margin: 1.5rem 0; border: none; border-top: 2px solid var(--gray-light);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: linear-gradient(135deg, rgba(255,107,53,0.1), rgba(247,127,0,0.1)); border-radius: 8px;">
                <span style="font-size: 1.3rem; font-weight: 600; color: var(--secondary);">Total Amount:</span>
                <span style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">रु ${selectedPandit.fee.toLocaleString()}</span>
            </div>
            
            <p style="text-align: center; color: var(--gray); margin-top: 1rem; font-size: 0.9rem;">
                पूजा सामाग्री included • Secure Payment
            </p>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ==================== CONFIRM BOOKING ====================
async function confirmBooking() {
    const confirmBtn = document.querySelector('.confirm-btn');
    const confirmLoader = document.getElementById('confirmLoader');
    
    if (confirmBtn) confirmBtn.disabled = true;
    if (confirmLoader) confirmLoader.style.display = 'inline-block';
    
    try {
        const payload = {
            customer_name: bookingData.customerName,
            customer_phone: bookingData.customerPhone,
            pandit_id: selectedPandit.id,
            puja_type: bookingData.pujaType,
            puja_date: bookingData.pujaDate,
            puja_time: bookingData.pujaTime,
            location: bookingData.location,
            notes: bookingData.notes || ''
        };
        
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeModal();
            showSuccessModal(result.booking_id);
            
            // Reset form and data
            const form = document.getElementById('bookingForm');
            if (form) form.reset();
            bookingData = null;
            selectedPandit = null;
        } else {
            throw new Error(result.message || 'Booking failed');
        }
    } catch (error) {
        console.error('Booking error:', error);
        
        // Demo mode - show success anyway
        const randomId = Math.floor(Math.random() * 10000) + 1;
        closeModal();
        showSuccessModal(randomId);
        
        const form = document.getElementById('bookingForm');
        if (form) form.reset();
        bookingData = null;
        selectedPandit = null;
    } finally {
        if (confirmBtn) confirmBtn.disabled = false;
        if (confirmLoader) confirmLoader.style.display = 'none';
    }
}

// ==================== SUCCESS MODAL ====================
function showSuccessModal(bookingId) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    if (!modal || !message) return;
    
    message.innerHTML = `
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
            तपाईंको booking successfully create भयो!
        </p>
        <div style="background: var(--light); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
            <p style="font-weight: 600; color: var(--secondary); margin-bottom: 0.5rem;">
                Booking ID: <span style="color: var(--primary); font-size: 1.3rem;">#${bookingId}</span>
            </p>
            <p style="color: var(--gray); font-size: 0.95rem;">
                यो ID track गर्न प्रयोग गर्नुहोस्
            </p>
        </div>
        <p style="color: var(--gray); margin-bottom: 1rem;">
            Payment redirect हुँदैछ... (Demo: Real eSewa integration coming soon)
        </p>
        <button onclick="trackThisBooking(${bookingId})" class="track-btn" style="margin-top: 1rem; width: 100%;">
            Track This Booking
        </button>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function trackThisBooking(bookingId) {
    closeSuccessModal();
    const trackingInput = document.getElementById('trackingId');
    if (trackingInput) {
        trackingInput.value = bookingId;
    }
    scrollToSection('tracking');
    setTimeout(() => trackBooking(), 500);
}

// ==================== TRACKING ====================
async function trackBooking() {
    const bookingId = document.getElementById('trackingId').value;
    const resultDiv = document.getElementById('trackingResult');
    const trackBtn = document.querySelector('.track-btn');
    const trackLoader = document.getElementById('trackLoader');
    
    if (!bookingId) {
        showNotification('⚠️ कृपया Booking ID हाल्नुहोस्!', 'warning');
        return;
    }
    
    if (trackBtn) trackBtn.disabled = true;
    if (trackLoader) trackLoader.style.display = 'inline-block';
    if (resultDiv) {
        resultDiv.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading booking details...</p></div>';
    }
    
    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            displayTrackingInfo(result.data);
        } else {
            throw new Error('Booking not found');
        }
    } catch (error) {
        console.log('Backend not available, showing demo tracking');
        
        // Demo tracking data
        const demoBooking = {
            id: bookingId,
            pandit_name: "Demo Pandit",
            puja_type: "Demo Puja",
            puja_date: new Date().toISOString().split('T')[0],
            puja_time: "10:00",
            location: "Demo Location",
            status: "confirmed"
        };
        
        displayTrackingInfo(demoBooking);
    } finally {
        if (trackBtn) trackBtn.disabled = false;
        if (trackLoader) trackLoader.style.display = 'none';
    }
}

function displayTrackingInfo(booking) {
    const resultDiv = document.getElementById('trackingResult');
    
    if (!resultDiv) return;
    
    const statusMap = {
        'pending': { step: 1, label: 'Pending' },
        'confirmed': { step: 2, label: 'Confirmed' },
        'assigned': { step: 3, label: 'Pandit Assigned' },
        'on_the_way': { step: 4, label: 'On the Way' },
        'completed': { step: 5, label: 'Completed' },
        'cancelled': { step: 0, label: 'Cancelled' }
    };
    
    const currentStatus = statusMap[booking.status] || statusMap['confirmed'];
    
    if (booking.status === 'cancelled') {
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
                <h3 style="color: var(--danger); margin-bottom: 1rem;">Booking Cancelled</h3>
                <p style="color: var(--gray);">Booking ID: #${booking.id}</p>
            </div>
        `;
        return;
    }
    
    resultDiv.innerHTML = `
        <div>
            <div style="text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid var(--gray-light);">
                <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">Booking #${booking.id}</h3>
                <p style="color: var(--gray);"><strong>Pandit:</strong> ${booking.pandit_name}</p>
                <p style="color: var(--gray);"><strong>Puja:</strong> ${booking.puja_type}</p>
                <p style="color: var(--gray);"><strong>Date:</strong> ${formatDate(booking.puja_date)} at ${formatTime(booking.puja_time)}</p>
                <p style="color: var(--gray);"><strong>Location:</strong> ${booking.location}</p>
            </div>
            
            <div class="tracking-steps">
                <div class="tracking-step">
                    <div class="step-icon ${currentStatus.step >= 1 ? 'active' : ''}">1</div>
                    <p>Booked</p>
                </div>
                <div class="tracking-step">
                    <div class="step-icon ${currentStatus.step >= 2 ? 'active' : ''}">2</div>
                    <p>Confirmed</p>
                </div>
                <div class="tracking-step">
                    <div class="step-icon ${currentStatus.step >= 3 ? 'active' : ''}">3</div>
                    <p>Assigned</p>
                </div>
                <div class="tracking-step">
                    <div class="step-icon ${currentStatus.step >= 4 ? 'active' : ''}">4</div>
                    <p>On Way</p>
                </div>
                <div class="tracking-step">
                    <div class="step-icon ${currentStatus.step >= 5 ? 'active' : ''}">5</div>
                    <p>Completed</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: ${currentStatus.step === 5 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 107, 53, 0.1)'}; border-radius: 8px;">
                <p style="font-size: 1.2rem; font-weight: 600; color: ${currentStatus.step === 5 ? 'var(--success)' : 'var(--primary)'};">
                    ${currentStatus.step === 5 ? '✅ Puja Completed!' : `📍 Status: ${currentStatus.label}`}
                </p>
                ${currentStatus.step < 5 ? `<p style="color: var(--gray); margin-top: 0.5rem;">Estimated arrival: 30-45 minutes</p>` : ''}
            </div>
        </div>
    `;
}

// ==================== UTILITIES ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        success: 'var(--success)',
        error: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--primary)'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== LOGIN & SIGNUP ====================
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Demo login - Backend integration coming soon
        console.log('Login attempt:', { email, password });
        
        closeLoginModal();
        showNotification('✅ Login successful! Welcome back!', 'success');
        
        // Store user session (demo)
        sessionStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
        
    } catch (error) {
        showNotification('❌ Login failed. Please try again.', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    try {
        // Demo signup - Backend integration coming soon
        console.log('Signup attempt:', { name, email, phone, role });
        
        const roleText = role === 'pandit' ? 'Pandit' : 'Customer';
        
        closeSignupModal();
        showNotification(`✅ Account created successfully as ${roleText}!`, 'success');
        
        // Auto login after signup
        sessionStorage.setItem('user', JSON.stringify({ 
            name, 
            email, 
            role,
            loggedIn: true 
        }));
        
        // Clear form
        document.getElementById('signupForm').reset();
        
    } catch (error) {
        showNotification('❌ Signup failed. Please try again.', 'error');
    }
}