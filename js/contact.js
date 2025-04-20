// Initialize EmailJS
(function() {
  emailjs.init('ojLsDsUFEr7AvxogL');
})();

function SendMail(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('button');
  const form = document.getElementById('contact-form');
  
  
  // Prepare email data
  const templateParams = {
    name: `${document.getElementById('name').value} ${document.getElementById('last-name').value}`,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value || 'Not provided',
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    date: new Date().toLocaleString()
  };

  // Send email with complete handling
  emailjs.send('service_zxwz8zk', 'template_3456btj', templateParams).then(alert('Email sent successfully!'))
}

