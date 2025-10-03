const { sendMail } = require('../utils/mailer');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const adminEmail = '2004ankitpradhan@gmail.com';
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject || 'Contact Form'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `;

    await sendMail({ to: adminEmail, subject: subject || 'Contact Form', html });
    return res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to send message' });
  }
};


