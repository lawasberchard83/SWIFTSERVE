import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const calculatePasswordStrength = (password) => {
    if (!password) return { level: '', color: '', width: '0%', score: 0 };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 'Weak', color: '#e53935', width: '33%', score };
    if (score <= 4) return { level: 'Medium', color: '#fb8c00', width: '66%', score };
    return { level: 'Strong', color: '#43a047', width: '100%', score };
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});

    const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear field error when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const validateFields = () => {
        const errors = {};

        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email address';

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';

        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        else if (!formData.phone.startsWith('0')) errors.phone = 'Phone number must start with 0';
        else if (formData.phone.length !== 11) errors.phone = 'Phone number must be exactly 11 digits';

        if (!formData.address.trim()) errors.address = 'Address is required';

        if (!formData.password) errors.password = 'Password is required';
        else if (passwordStrength.score <= 2) errors.password = 'Password is too weak. Add uppercase, numbers, or special characters.';

        if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords don't match";

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const errors = validateFields();
        setFieldErrors(errors);
        // Mark all fields as touched on submit
        const allTouched = {};
        Object.keys(formData).forEach(key => allTouched[key] = true);
        setTouched(allTouched);

        if (Object.keys(errors).length > 0) {
            setError('Please fix the highlighted errors below.');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: dbError } = await supabase
                .from('users')
                .insert([
                    {
                        username: formData.email,
                        password: formData.password,
                        email: formData.email,
                        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                        phone: formData.phone,
                        address: formData.address
                    }
                ])
                .select();

            if (dbError) {
                setError(dbError.message || 'Registration failed');
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', formData.email);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Cannot connect to the server: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = (fieldName) => ({
        border: fieldErrors[fieldName] && touched[fieldName] ? '2px solid #e53935' : undefined,
        backgroundColor: fieldErrors[fieldName] && touched[fieldName] ? '#fff5f5' : undefined,
    });

    const fieldErrorStyle = {
        color: '#e53935',
        fontSize: '12px',
        marginTop: '4px',
        fontWeight: '500',
    };

    return (
        <div className="auth-container flex w-full">
            <div className="auth-left register-bg">
                <div className="auth-logo">SWIFTSERVE</div>
                <div className="auth-quote" style={{ zIndex: 10, position: 'relative', margin: 'auto 0 40px 0' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: '1.2', textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>
                        "Taste the speed,<br/>savor the moment."
                    </h2>
                    <p style={{ fontSize: '18px', color: '#e0e0e0', fontWeight: '500', lineHeight: '1.5', textShadow: '0 2px 8px rgba(0,0,0,0.6)', maxWidth: '400px' }}>
                        Join SwiftServe today and experience the fastest, most reliable food delivery service in town. Fresh, hot, and right at your doorstep.
                    </p>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-form-container">
                    <div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join us to experience the fastest delivery.</p>
                    </div>

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ef9a9a' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                style={inputStyle('email')}
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your email"
                            />
                            {fieldErrors.email && touched.email && <div style={fieldErrorStyle}>{fieldErrors.email}</div>}
                        </div>

                        {/* First Name / Last Name */}
                        <div className="flex gap-4" style={{ display: 'flex', gap: '16px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-input"
                                    style={inputStyle('firstName')}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="First name"
                                />
                                {fieldErrors.firstName && touched.firstName && <div style={fieldErrorStyle}>{fieldErrors.firstName}</div>}
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-input"
                                    style={inputStyle('lastName')}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Last name"
                                />
                                {fieldErrors.lastName && touched.lastName && <div style={fieldErrorStyle}>{fieldErrors.lastName}</div>}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                style={inputStyle('phone')}
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 11) {
                                        setFormData({ ...formData, phone: val });
                                        if (fieldErrors.phone) {
                                            setFieldErrors({ ...fieldErrors, phone: '' });
                                        }
                                    }
                                }}
                                onBlur={handleBlur}
                                placeholder="09xxxxxxxxx"
                                maxLength={11}
                            />
                            {fieldErrors.phone && touched.phone && <div style={fieldErrorStyle}>{fieldErrors.phone}</div>}
                        </div>

                        {/* Address */}
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                style={inputStyle('address')}
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your address"
                            />
                            {fieldErrors.address && touched.address && <div style={fieldErrorStyle}>{fieldErrors.address}</div>}
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                style={inputStyle('password')}
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your password"
                            />
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{
                                        height: '6px',
                                        width: '100%',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '3px',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: passwordStrength.width,
                                            backgroundColor: passwordStrength.color,
                                            borderRadius: '3px',
                                            transition: 'width 0.3s ease, background-color 0.3s ease',
                                        }} />
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: passwordStrength.color,
                                        marginTop: '4px',
                                        display: 'inline-block',
                                    }}>
                                        Password Strength: {passwordStrength.level}
                                    </span>
                                </div>
                            )}
                            {fieldErrors.password && touched.password && <div style={fieldErrorStyle}>{fieldErrors.password}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                style={inputStyle('confirmPassword')}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Confirm your password"
                            />
                            {fieldErrors.confirmPassword && touched.confirmPassword && <div style={fieldErrorStyle}>{fieldErrors.confirmPassword}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '10px' }} disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <div className="form-text">
                        Already have an account? <Link to="/login" className="form-link">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
