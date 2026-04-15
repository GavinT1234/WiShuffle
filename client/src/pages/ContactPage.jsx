import React, { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-6">
              Have questions, feedback, or want to report an issue? We'd love to hear from you! Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-base-content/70">support@wishuffle.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-base-content/70">We typically respond within 24 hours</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Social Media</h3>
                <div className="flex gap-4">
                  <a href="#" className="link text-success">Twitter</a>
                  <a href="#" className="link text-success">Instagram</a>
                  <a href="#" className="link text-success">Discord</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  className="textarea textarea-bordered h-32"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success w-full">
                Send Message
              </button>

              {submitted && (
                <div className="alert alert-success">
                  <span>Thank you! We'll be in touch soon.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
