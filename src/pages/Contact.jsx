import { useState } from 'react';
import api from '../api/axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length > 100) return 'Name must be under 100 characters';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return 'Please enter a valid email address';
                return '';
            case 'subject':
                if (!value.trim()) return 'Subject is required';
                if (value.trim().length > 200) return 'Subject must be under 200 characters';
                return '';
            case 'message':
                if (!value.trim()) return 'Message is required';
                if (value.trim().length > 5000) return 'Message must be under 5000 characters';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error on change
        if (errors[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const validateAll = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        if (!validateAll()) return;

        setLoading(true);
        try {
            const res = await api.post('/contact', formData);
            setStatus('success');
            setStatusMessage(res.data.message);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setErrors({});
        } catch (err) {
            setStatus('error');
            setStatusMessage(
                err.response?.data?.message ||
                err.response?.data?.errors?.[0] ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
            // Auto-dismiss after 8s
            setTimeout(() => setStatus(null), 8000);
        }
    };

    return (
        <div className="contact-page">
            {/* Decorative background orbs */}
            <div className="contact-orb contact-orb-1" />
            <div className="contact-orb contact-orb-2" />

            <div className="contact-container">
                {/* ── Profile Header ── */}
                <div className="contact-profile">
                    <div className="contact-avatar">
                        {/* <img src="Me_new.jpg" alt="BG" /> */}
                        <span className="contact-avatar-text">BG</span>
                    </div>
                    <h1 className="contact-name">Bhanu Gaur</h1>
                    <p className="contact-title">Software Engineer</p>
                    <p className="contact-intro">
                        Passionate about building scalable web applications and crafting
                        delightful user experiences. I love turning ideas into elegant,
                        production-ready code. Let&apos;s connect and create something amazing
                        together!
                    </p>
                    <div className="contact-divider" />
                </div>

                {/* ── Form Section ── */}
                <div className="contact-form-section">
                    <h2 className="contact-form-heading">
                        <span className="contact-heading-icon">✉</span>
                        Get In Touch
                    </h2>
                    <p className="contact-form-subheading">
                        Have a question or want to work together? Drop me a message below.
                    </p>

                    {/* Status Messages */}
                    {status && (
                        <div className={`contact-alert contact-alert-${status}`}>
                            <span className="contact-alert-icon">
                                {status === 'success' ? '✓' : '✕'}
                            </span>
                            {statusMessage}
                        </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                        <div className="contact-form-row">
                            <div className="contact-field">
                                <label className="contact-label" htmlFor="contact-name">
                                    Full Name
                                </label>
                                <input
                                    id="contact-name"
                                    className={`contact-input ${errors.name ? 'contact-input-error' : ''}`}
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <span className="contact-error">{errors.name}</span>
                                )}
                            </div>
                            <div className="contact-field">
                                <label className="contact-label" htmlFor="contact-email">
                                    Email Address
                                </label>
                                <input
                                    id="contact-email"
                                    className={`contact-input ${errors.email ? 'contact-input-error' : ''}`}
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <span className="contact-error">{errors.email}</span>
                                )}
                            </div>
                        </div>

                        <div className="contact-field">
                            <label className="contact-label" htmlFor="contact-subject">
                                Subject
                            </label>
                            <input
                                id="contact-subject"
                                className={`contact-input ${errors.subject ? 'contact-input-error' : ''}`}
                                type="text"
                                name="subject"
                                placeholder="Project Inquiry"
                                value={formData.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                            {errors.subject && (
                                <span className="contact-error">{errors.subject}</span>
                            )}
                        </div>

                        <div className="contact-field">
                            <label className="contact-label" htmlFor="contact-message">
                                Message
                            </label>
                            <textarea
                                id="contact-message"
                                className={`contact-input contact-textarea ${errors.message ? 'contact-input-error' : ''}`}
                                name="message"
                                placeholder="Tell me about your project or idea..."
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                            {errors.message && (
                                <span className="contact-error">{errors.message}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="contact-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="contact-spinner-wrap">
                                    <span className="contact-spinner" />
                                    Sending...
                                </span>
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <span className="contact-btn-arrow">→</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
