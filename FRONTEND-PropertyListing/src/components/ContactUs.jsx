import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={onChange} className="form-input" placeholder="Your Name" required />
          <input type="email" name="email" value={form.email} onChange={onChange} className="form-input" placeholder="Your Email" required />
          <input name="phone" value={form.phone} onChange={onChange} className="form-input" placeholder="Phone (optional)" />
          <input name="subject" value={form.subject} onChange={onChange} className="form-input" placeholder="Subject" />
          <textarea name="message" value={form.message} onChange={onChange} className="form-input md:col-span-2" rows={5} placeholder="Your message" required />
          <div className="md:col-span-2">
            <button disabled={submitting} className="btn-primary w-full md:w-auto">
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;


