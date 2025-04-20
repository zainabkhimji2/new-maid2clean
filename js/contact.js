// Initialize EmailJS
(function() {
  emailjs.init('ojLsDsUFEr7AvxogL');
})();

function SendMail(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('button');
  const form = document.getElementById('contact-form');
  
  // Show loading state
  submitBtn.disabled = true;
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

  // Prepare email data
  const templateParams = {
    from_name: `${document.getElementById('name').value} ${document.getElementById('last-name').value}`,
    from_email: document.getElementById('email').value,
    phone_number: document.getElementById('phone').value || 'Not provided',
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    date: new Date().toLocaleString()
  };

  // Send email with complete handling
  emailjs.send('service_zxwz8zk', 'template_3456btj', templateParams).then(alert('Email sent successfully!'))
}

