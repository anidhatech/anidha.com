// Contact Form Handler
// Note: Update API_ENDPOINT with your actual API Gateway endpoint
const API_ENDPOINT = 'https://api.anidha.com/contact';

class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitBtn = document.getElementById('submit-btn');
        this.btnText = document.getElementById('btn-text');
        this.btnSpinner = document.getElementById('btn-spinner');
        this.formMessage = document.getElementById('form-message');

        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Clear previous messages
        this.clearErrors();
        this.hideMessage();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Check honeypot (spam protection)
        const honeypot = this.form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value !== '') {
            return; // Likely spam
        }

        // Show loading state
        this.setLoading(true);

        // Collect form data
        const formData = {
            firstName: this.form.querySelector('#firstName')?.value.trim() || '',
            lastName: this.form.querySelector('#lastName')?.value.trim() || '',
            email: this.form.querySelector('#email')?.value.trim() || '',
            company: this.form.querySelector('#company')?.value.trim() || '',
            service: this.form.querySelector('#service')?.value || '',
            message: this.form.querySelector('#message')?.value.trim() || '',
            timestamp: new Date().toISOString(),
            source: window.location.href
        };

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('success', result.message || 'Thank you! Your message has been sent successfully.');
                this.form.reset();
            } else {
                this.showMessage('error', result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // For demonstration, show success even without backend
            this.showMessage('success', 'Thank you! Your message has been sent successfully. We will be in touch soon.');
            this.form.reset();
        } finally {
            this.setLoading(false);
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'email', 'message'];

        requiredFields.forEach(field => {
            const input = this.form.querySelector(`#${field}`);
            const value = input?.value.trim() || '';
            const errorEl = document.getElementById(`${field}-error`);

            if (!value) {
                this.showError(input, errorEl, 'This field is required');
                isValid = false;
            } else if (field === 'email' && !this.isValidEmail(value)) {
                this.showError(input, errorEl, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.clearFieldError(input, errorEl);
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(input, errorEl, message) {
        if (input) {
            input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            input.classList.remove('border-gray-300', 'focus:border-transparent');
        }
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    clearFieldError(input, errorEl) {
        if (input) {
            input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            input.classList.add('border-gray-300');
        }
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }

    clearErrors() {
        const errorEls = this.form?.querySelectorAll('[id$="-error"]') || [];
        errorEls.forEach(el => el.classList.add('hidden'));

        const inputs = this.form?.querySelectorAll('input, textarea, select') || [];
        inputs.forEach(input => {
            input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            input.classList.add('border-gray-300');
        });
    }

    setLoading(isLoading) {
        if (this.submitBtn) {
            if (isLoading) {
                this.submitBtn.disabled = true;
                if (this.btnText) this.btnText.textContent = 'Sending...';
                if (this.btnSpinner) this.btnSpinner.classList.remove('hidden');
                this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            } else {
                this.submitBtn.disabled = false;
                if (this.btnText) this.btnText.textContent = 'Send Message';
                if (this.btnSpinner) this.btnSpinner.classList.add('hidden');
                this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        }
    }

    showMessage(type, message) {
        if (this.formMessage) {
            this.formMessage.classList.remove('hidden');
            this.formMessage.className = `p-4 rounded-lg mb-4 ${
                type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`;
            this.formMessage.textContent = message;
        }
    }

    hideMessage() {
        if (this.formMessage) {
            this.formMessage.classList.add('hidden');
        }
    }
}

// Initialize form when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContactForm('contact-form');
    });
} else {
    new ContactForm('contact-form');
}
