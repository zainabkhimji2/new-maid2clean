// Initialize EmailJS
(function() {
  emailjs.init('ojLsDsUFEr7AvxogL');
})();

function showMessageModal(isSuccess, message) {
  const modal = document.getElementById('message-modal');
  const successIcon = modal.querySelector('.success-icon');
  const errorIcon = modal.querySelector('.error-icon');
  const title = modal.querySelector('.modal-title');
  const msg = modal.querySelector('.modal-message');

  if(isSuccess) {
    successIcon.classList.remove('hidden');
    errorIcon.classList.add('hidden');
    title.textContent = 'Message Sent!';
    title.classList.remove('text-red-600');
    title.classList.add('text-green-600');
    msg.textContent = message || 'Thank you for contacting us. Well respond shortly.';
  } else {
    successIcon.classList.add('hidden');
    errorIcon.classList.remove('hidden');
    title.textContent = 'Sending Failed!';
    title.classList.remove('text-green-600');
    title.classList.add('text-red-600');
    msg.textContent = message || 'Failed to send message. Please try again.';
  }

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.querySelector('div').classList.remove('scale-95');
}

function closeMessageModal() {
  const modal = document.getElementById('message-modal');
  modal.querySelector('div').classList.add('scale-95');
  modal.classList.add('opacity-0', 'pointer-events-none');
  document.getElementById('contact-form').reset();
}

function SendMail(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('button');

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending...';

  const templateParams = {
    name: `${document.getElementById('name').value} ${document.getElementById('last-name').value}`,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value || 'Not provided',
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    date: new Date().toLocaleString()
  };

  emailjs.send('service_zxwz8zk', 'template_3456btj', templateParams)
    .then(() => {
      form.reset(); // Add this line to reset the form
      showMessageModal(true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
    })
    .catch(error => {
      console.error('Email send failed:', error);
      showMessageModal(false, 'Failed to send message. Please check your connection.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
    });
}