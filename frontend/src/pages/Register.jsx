import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (!formData.phone.startsWith('0')) {
            setError("Phone number must start with 0");
            return;
        }

        if (formData.phone.length !== 11) {
            setError("Phone number must be exactly 11 digits long");
            return;
        }

        setIsLoading(true);

        try {
            // Insert user directly into the Supabase 'users' table
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
                // Registration successful
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

    return (
        <div className="auth-container flex w-full">
            <div className="auth-left register-bg">
                <div className="auth-logo">SWIFTSERVE</div>
                <div className="auth-welcome">JOIN SWIFTSERVE !</div>
            </div>
            <div className="auth-right">
                <div className="auth-form-container">
                    <h1 className="auth-title">Register</h1>
                    
                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ef9a9a' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex gap-4" style={{ display: 'flex', gap: '16px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 11) {
                                        setFormData({ ...formData, phone: val });
                                    }
                                }}
                                placeholder="09xxxxxxxxx"
                                maxLength={11}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
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
