document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const form = document.getElementById('registrationForm');
  const formMessage = document.getElementById('formMessage');

  // Toggle mobile navigation menu
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Close mobile nav on nav link click & set active
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active class from all
      navLinks.forEach(lnk => lnk.classList.remove('active'));
      e.target.classList.add('active');
      // Close mobile nav
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  });

  // Highlight nav link on scroll
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY || window.pageYOffset;

    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (
        section.offsetTop <= scrollPos + 60 && 
        (section.offsetTop + section.offsetHeight) > scrollPos + 60
      ) {
        navLinks.forEach(lnk => lnk.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // FORM VALIDATION
  const showError = (input, message) => {
    const errorEl = document.getElementById(`error-${input.name}`);
    errorEl.textContent = message;
    input.classList.add('input-error');
  };

  const clearError = (input) => {
    const errorEl = document.getElementById(`error-${input.name}`);
    errorEl.textContent = '';
    input.classList.remove('input-error');
  };

  const validateField = (input) => {
    const val = input.value.trim();
    let valid = true;

    switch (input.name) {
      case 'fullName':
        if (val.length < 3) {
          showError(input, 'Full name must be at least 3 characters.');
          valid = false;
        } else {
          clearError(input);
        }
        break;

      case 'age':
        const age = Number(val);
        if (!val || !Number.isInteger(age) || age < 18 || age > 65) {
          showError(input, 'Age must be between 18 and 65.');
          valid = false;
        } else {
          clearError(input);
        }
        break;

      case 'bloodType':
        if (!val) {
          showError(input, 'Please select a blood type.');
          valid = false;
        } else {
          clearError(input);
        }
        break;

      case 'contact':
        const pattern = /^[0-9]{10,15}$/;
        if (!pattern.test(val)) {
          showError(input, 'Enter a valid contact number (10-15 digits).');
          valid = false;
        } else {
          clearError(input);
        }
        break;
    }
    return valid;
  };

  // Validate all fields
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => validateField(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) {
      formMessage.textContent = 'Please fix errors before submitting.';
      formMessage.style.color = '#dc2626'; // red
      return;
    }

    // Simulate form success submission
    formMessage.textContent = '';
    // Fake delay to mimic sending data
    formMessage.textContent = 'Submitting...';
    formMessage.style.color = '#111';

    setTimeout(() => {
      formMessage.textContent = `Thank you, ${form.fullName.value.trim()}, for registering as a donor! We will contact you soon.`;
      formMessage.style.color = '#22c55e'; // emerald green
      form.reset();

      // Clear errors if any
      inputs.forEach(input => clearError(input));
    }, 1200);
  });
});
