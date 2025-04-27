// Login page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic form validation
            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }
            
            // In a real application, this would send the credentials to a server for authentication
            // For this demo, we'll simulate a successful login
            
            // Store the login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Handle create account button
    const createAccountButton = document.querySelector('.create-account-button');
    
    if (createAccountButton) {
        createAccountButton.addEventListener('click', function() {
            // In a real application, this would redirect to a registration page
            alert('Registration functionality would be implemented in a real application.');
            
            // For demo purposes, simulate account creation
            const email = document.getElementById('email').value;
            
            if (email) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('Please enter an email address.');
            }
        });
    }
    
    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would redirect to a password reset page
            alert('Password reset functionality would be implemented in a real application.');
        });
    }
}); 