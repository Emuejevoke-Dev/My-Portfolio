(function() {
  "use strict";

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.navmenu');
  const navMenuLinks = document.querySelectorAll('#navmenu a');

  function toggleMobileMenu() {
    if (!navMenu || !mobileNavToggleBtn) return;

    const isOpen = document.body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.setAttribute('aria-expanded', String(isOpen));

    const icon = mobileNavToggleBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('bi-list', !isOpen);
      icon.classList.toggle('bi-x', isOpen);
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', toggleMobileMenu);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  navMenuLinks.forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) {
        toggleMobileMenu();
      }
    });
  });

  /**
   * Close mobile menu on resize to desktop
   */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1199 && document.body.classList.contains('mobile-nav-active')) {
      document.body.classList.remove('mobile-nav-active');
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileNavToggleBtn.querySelector('i');
        if (icon) {
          icon.classList.add('bi-list');
          icon.classList.remove('bi-x');
        }
      }
    }
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * EmailJS Contact Form
   */
  const EMAILJS_PUBLIC_KEY = 'pvDFSjtolPWD0Dy6G';
  const EMAILJS_SERVICE_ID = 'service_jr8mu3q';
  const EMAILJS_TEMPLATE_ID = 'template_h3i8ch5';

  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const loadingDiv = document.getElementById('loading');
      const errorDiv = document.getElementById('errorMessage');
      const successDiv = document.getElementById('successMessage');

      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';
      errorDiv.innerHTML = '';

      const name = document.querySelector('input[name="name"]').value.trim();
      const email = document.querySelector('input[name="email"]').value.trim();
      const subject = document.querySelector('input[name="subject"]').value.trim();
      const message = document.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !subject || !message) {
        errorDiv.innerHTML = 'Please fill in all fields.';
        errorDiv.style.display = 'block';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorDiv.innerHTML = 'Please enter a valid email address.';
        errorDiv.style.display = 'block';
        return;
      }

      loadingDiv.style.display = 'block';
      loadingDiv.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        this
      ).then(function(response) {
        console.log('Email sent successfully:', response);

        loadingDiv.style.display = 'none';
        submitBtn.disabled = false;

        successDiv.textContent = 'Message sent successfully! Thank you for reaching out.';
        successDiv.style.display = 'block';

        contactForm.reset();

        setTimeout(() => {
          successDiv.style.display = 'none';
        }, 5000);
      }).catch(function(error) {
        console.error('EmailJS sendForm error:', error);

        loadingDiv.style.display = 'none';
        submitBtn.disabled = false;

        errorDiv.innerHTML = 'Failed to send message. Please try again later.' + (error && error.text ? ' (' + error.text + ')' : '');
        errorDiv.style.display = 'block';
      });
    });
  }

})();
