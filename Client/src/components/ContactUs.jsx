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
      <div className="bg-gradient-to-br from-orange-300 to-orange-700 rounded-lg shadow-sm p-6 relative overflow-hidden">
        {/* Floating Animation Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-8 w-12 h-12 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-16 right-20 w-6 h-6 bg-white/30 rotate-45 animate-pulse" style={{animationDelay: '1s', animationDuration: '2s'}}></div>
          <div className="absolute bottom-8 right-12 w-8 h-8 bg-white/25 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
          <div className="absolute top-8 right-32 w-4 h-4 bg-white/35 animate-spin" style={{animationDelay: '0.5s', animationDuration: '6s'}}></div>
          <div className="absolute bottom-16 right-6 w-10 h-2 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3s'}}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">Contact Us</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={onChange} className="form-input" placeholder="Your Name" required />
          <input type="email" name="email" value={form.email} onChange={onChange} className="form-input" placeholder="Your Email" required />
          <input name="phone" value={form.phone} onChange={onChange} className="form-input" placeholder="Phone (optional)" />
          <input name="subject" value={form.subject} onChange={onChange} className="form-input" placeholder="Subject" />
          <textarea name="message" value={form.message} onChange={onChange} className="form-input md:col-span-2" rows={5} placeholder="Your message" required />
          <div className="md:col-span-2">
            <button disabled={submitting} className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 w-full md:w-auto">
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;


