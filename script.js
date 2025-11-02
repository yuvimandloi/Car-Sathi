document.addEventListener('DOMContentLoaded', () => {

    // Helper function 1: Strict 10-digit numerical validation
    function isValidIndianPhoneNumber(input) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(input);
    }
    
    // Helper function 2: Age 18+ validation
    function isEighteenOrOlder(birthDateString) {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );
        return birthDate <= eighteenYearsAgo;
    }

    // --- Core Navigation and Status Check ---

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('carSaathiUserName');
            localStorage.removeItem('carSaathiIdentifierType');
            localStorage.removeItem('carSaathiIdentifierValue');
            localStorage.removeItem('carSaathiMemberSince');
            
            alert('👋 You have been successfully logged out.');
            window.location.href = 'index.html'; 
        });
    }

    function checkLoginStatus() {
        const loggedOutLinks = document.getElementById('logged-out-links');
        const loggedInLinks = document.getElementById('logged-in-links');
        const userName = localStorage.getItem('carSaathiUserName');

        if (userName) {
            if (loggedOutLinks) loggedOutLinks.style.display = 'none';
            if (loggedInLinks) loggedInLinks.style.display = 'inline';
            return true; // Logged in
        } else {
            if (loggedOutLinks) loggedOutLinks.style.display = 'inline';
            if (loggedInLinks) loggedInLinks.style.display = 'none';
            return false; // Logged out
        }
    }
    
    checkLoginStatus();

    // --- NEW SECURITY GATE: Offer a Ride Redirection ---
    if (window.location.pathname.endsWith('offer-ride.html')) {
        if (!checkLoginStatus()) {
            alert('🔒 You must be logged in to offer a ride. Redirecting to login page.');
            window.location.href = 'login.html';
            return; // Stop execution on this page
        }
    }
    // ---------------------------------------------------


    // --- Global Click Listener for Booking ---
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-book')) {
            event.preventDefault();

            const rideCard = event.target.closest('.ride-card');
            const rideTime = rideCard.querySelector('.ride-time').textContent.trim();
            const rideRoute = rideCard.querySelector('.ride-route').textContent.trim();
            const ridePrice = rideCard.querySelector('.price').textContent.trim();
            const driverInfo = rideCard.querySelector('.driver-info p:first-child').textContent.trim();

            if (checkLoginStatus()) {
                const userName = localStorage.getItem('carSaathiUserName') || 'User';
                
                alert(`🎉 Booking Confirmation for ${userName}!\n\nYour seat is reserved for:\n\nRoute: ${rideRoute}\nTime: ${rideTime}\nPrice: ${ridePrice}\n${driverInfo}\n\n(Note: This is a mock booking. Payment would occur here in a real application.)`);
            } else {
                alert('🔒 You must be logged in to book a seat. Redirecting to login page.');
                window.location.href = 'login.html';
            }
        }
    });

    // --- Form Logic Start ---
    
    // --- Logic for the 'Find a Ride' Search Form (index.html) ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const leaving = document.getElementById('leaving').value;
            const going = document.getElementById('going').value;
            const when = document.getElementById('when').value;
            
            if (!leaving || !going) {
                alert("Please enter both a 'Leaving from' and 'Going to' destination.");
                return;
            }

            window.location.href = `results.html?from=${encodeURIComponent(leaving)}&to=${encodeURIComponent(going)}&date=${encodeURIComponent(when)}`;
        });
    }

    // --- Logic for the 'Offer a Ride' Form (offer-ride.html) ---
    const offerForm = document.getElementById('offer-form');
    if (offerForm) {
        offerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const departure = document.getElementById('departure').value;
            const destination = document.getElementById('destination').value;
            const price = document.getElementById('price').value;

            if (!departure || !destination || !price) {
                 alert("Please fill in all required fields to publish your ride.");
                 return;
            }
            alert(`✅ Success! Your ride from ${departure} to ${destination} for ₹${price} per seat has been published on Car Saathi!`);
            offerForm.reset();
        });
    }

    // --- Logic for the 'Login' Form (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const identifier = document.getElementById('email-or-phone').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!identifier || !password) {
                alert("Please enter your login details.");
                return;
            }

            const isStrictPhoneNumber = /^\d{10}$/.test(identifier);
            if (isStrictPhoneNumber) {
                localStorage.setItem('carSaathiIdentifierType', 'phone');
                localStorage.setItem('carSaathiIdentifierValue', identifier);
            } else if (identifier.includes('@') && identifier.includes('.')) {
                localStorage.setItem('carSaathiIdentifierType', 'email');
                localStorage.setItem('carSaathiIdentifierValue', identifier);
            } else {
                 alert("❌ Validation Error: Please enter a valid email address or a 10-digit phone number.");
                 return;
            }
            if (password.length < 6) {
                alert("❌ Validation Error: Password must be at least 6 characters long.");
                return;
            }

            localStorage.setItem('carSaathiUserName', 'Saathi Traveler'); 
            if (!localStorage.getItem('carSaathiMemberSince')) {
                 const mockDate = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                 localStorage.setItem('carSaathiMemberSince', mockDate);
            }
            
            alert(`🔓 Successfully logged in! Redirecting to dashboard...`);
            window.location.href = 'profile.html';
        });
    }

    // --- Logic for the 'Sign Up' Form (signup.html) ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const fullName = document.getElementById('full-name').value.trim();
            const identifier = document.getElementById('email-or-phone-signup').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const birthDate = document.getElementById('birth-date').value;

            if (!fullName || !identifier || !password || !birthDate) {
                 alert("❌ Please fill in all required fields.");
                 return;
            }
            if (!isEighteenOrOlder(birthDate)) {
                 alert("🔞 Validation Error: You must be 18 years or older to create a Car Saathi account.");
                 return;
            }
            if (password.length < 6) {
                alert("❌ Validation Error: Password must be at least 6 characters long.");
                return;
            }
            const isStrictPhoneNumber = /^\d{10}$/.test(identifier);
            if (isStrictPhoneNumber) {
                localStorage.setItem('carSaathiIdentifierType', 'phone');
                localStorage.setItem('carSaathiIdentifierValue', identifier);
            } else if (identifier.includes('@') && identifier.includes('.')) {
                localStorage.setItem('carSaathiIdentifierType', 'email');
                localStorage.setItem('carSaathiIdentifierValue', identifier);
            } else {
                 alert("❌ Validation Error: Please enter a valid email address or a 10-digit phone number.");
                 return;
            }

            const currentDate = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
            localStorage.setItem('carSaathiMemberSince', currentDate);
            localStorage.setItem('carSaathiUserName', fullName);
            
            alert(`🎉 Welcome ${fullName}! Your Car Saathi account has been created. Redirecting to your profile.`);
            window.location.href = 'profile.html'; 
        });
    }

    // --- Logic for the 'Forgot Password' Form (forgot-password.html) ---
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const resetIdentifier = document.getElementById('reset-identifier').value.trim();
            alert(`📧 Success! If ${resetIdentifier} is in our system, you will receive a password reset link shortly. Please check your inbox/SMS.`);
            window.location.href = 'login.html';
        });
    }

    // --- Logic for the Profile page (profile.html) ---
    if (window.location.pathname.endsWith('profile.html')) {
        const userName = localStorage.getItem('carSaathiUserName');
        const identifierType = localStorage.getItem('carSaathiIdentifierType');
        const identifierValue = localStorage.getItem('carSaathiIdentifierValue');
        const memberSince = localStorage.getItem('carSaathiMemberSince');

        if (userName) {
            document.querySelector('.profile-header h1').textContent = `Hello, ${userName}!`;
            document.getElementById('profile-user-name').textContent = userName;
        }

        const memberSinceElement = document.getElementById('member-since-date');
        if (memberSinceElement && memberSince) {
             memberSinceElement.textContent = memberSince;
        }
        
        if (identifierValue && identifierType) {
            const detailsBox = document.querySelector('.profile-details .info-box');
            
            if (detailsBox) {
                let identifierLine = detailsBox.querySelector('#identifier-line');
                if (!identifierLine) {
                     identifierLine = document.createElement('p');
                     identifierLine.id = 'identifier-line';
                     detailsBox.insertBefore(identifierLine, detailsBox.querySelector('p:nth-child(2)'));
                }

                if (identifierType === 'email') {
                    identifierLine.innerHTML = `Email: <span>${identifierValue}</span>`;
                } else if (identifierType === 'phone') {
                    identifierLine.innerHTML = `Phone: <span>${identifierValue}</span>`;
                }
                
                const verifiedPhone = document.querySelector('#verified-phone');
                const verifiedEmail = document.querySelector('#verified-email');
                
                if (verifiedPhone && verifiedEmail) {
                    verifiedPhone.textContent = identifierType === 'phone' ? '✅ Verified' : '--- N/A ---';
                    verifiedEmail.textContent = identifierType === 'email' ? '✅ Verified' : '--- N/A ---';
                }
            }
        }
    }
    
    // --- Logic for the Results Page (results.html) ---
    if (window.location.pathname.endsWith('results.html')) {
        
        // --- Price Slider Functionality ---
        const priceSlider = document.getElementById('max-price-slider');
        const priceDisplay = document.getElementById('max-price-display');

        if (priceSlider && priceDisplay) {
            priceDisplay.textContent = `₹ ${priceSlider.value}`;
            priceSlider.addEventListener('input', function() {
                priceDisplay.textContent = `₹ ${this.value}`;
            });
        }
        
        // 1. Dynamic Header Update
        const urlParams = new URLSearchParams(window.location.search);
        const fromCity = urlParams.get('from');
        const toCity = urlParams.get('to');
        
        const headerElement = document.getElementById('results-header');
        if (headerElement && fromCity && toCity) {
            headerElement.textContent = `Rides from ${fromCity} to ${toCity}`;
        } else if (headerElement) {
            headerElement.textContent = 'Available Rides';
        }

        // 2. Filter Logic (MOCK IMPLEMENTATION)
        const filterForm = document.getElementById('filter-form');
        const rideCards = document.querySelectorAll('.ride-card');

        const applyFilters = (event) => {
            if (event) event.preventDefault(); 
            
            const minTime = document.getElementById('min-time').value;
            const maxTime = document.getElementById('max-time').value;
            const maxPrice = priceSlider.value;
            const filterInstant = document.getElementById('filter-instant').checked;
            const filterMaxSeats = document.getElementById('filter-max-seats').checked;
            
            rideCards.forEach(card => {
                const cardTime = card.getAttribute('data-time');
                const cardPrice = parseInt(card.getAttribute('data-price'));
                const cardInstant = card.getAttribute('data-instant') === 'true';
                const cardMaxSeats = card.getAttribute('data-max-seats') === 'true';

                const timeMatches = cardTime >= minTime && cardTime <= maxTime;
                const priceMatches = cardPrice <= maxPrice;
                const instantMatches = !filterInstant || cardInstant;
                const maxSeatsMatches = !filterMaxSeats || cardMaxSeats;

                if (timeMatches && priceMatches && instantMatches && maxSeatsMatches) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            const alertMessage = `Filters Applied:\nTime: ${minTime} to ${maxTime}\nMax Price: ₹ ${maxPrice}\nInstant Booking: ${filterInstant ? 'Yes' : 'No'}\nMax 2 in Back: ${filterMaxSeats ? 'Yes' : 'No'}\n(Results updated on page.)`;
            alert(alertMessage);
        };
        
        if (filterForm) {
            filterForm.addEventListener('submit', applyFilters);
        }
        
        // 3. Create Alert Logic
        const createAlertBtn = document.getElementById('create-alert-btn');
        if (createAlertBtn) {
             createAlertBtn.addEventListener('click', function() {
                const searchRoute = headerElement ? headerElement.textContent.replace('Rides from ', '') : 'this route';
                alert(`🔔 Alert Created! We will notify you if new rides are found for ${searchRoute}.`);
             });
        }
    }
});