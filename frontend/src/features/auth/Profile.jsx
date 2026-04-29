import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import NavigationBar from '../../components/NavigationBar';
import Notification from '../../components/Notification';
import { Camera, User as UserIcon, Phone, MapPin, Shield, Edit2, Check, LogOut, Mail, Award, Lock } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [editData, setEditData] = useState({});
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    // Fetch user data from Supabase
    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (!isAuth) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', userEmail)
                .single();

            if (error || !data) {
                console.error('Failed to fetch user:', error);
                setLoading(false);
                return;
            }

            // Split full_name into first and last name
            const nameParts = (data.full_name || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const userData = {
                id: data.id,
                firstName,
                lastName,
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                avatar: data.profile_image && (data.profile_image.startsWith('http') || data.profile_image.startsWith('data:')) ? data.profile_image : null,
            };

            setUser(userData);
            setEditData(userData);
            setLoading(false);
        };

        fetchUser();
    }, [navigate]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                const updatedUser = { ...user, avatar: base64String };
                setUser(updatedUser);
                setEditData(updatedUser);

                // Persist to Supabase using their existing profile_image column
                const { error } = await supabase
                    .from('users')
                    .update({ profile_image: base64String })
                    .eq('id', user.id);
                
                if (error) {
                    console.error("Failed to save avatar to Supabase:", error);
                    showNotification("Failed to save profile picture permanently.", "error");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSavePersonal = async () => {
        const newFullName = `${editData.firstName} ${editData.lastName}`.trim();
        await supabase
            .from('users')
            .update({ full_name: newFullName })
            .eq('id', user.id);

        setUser({ ...user, firstName: editData.firstName, lastName: editData.lastName });
        localStorage.setItem('userName', newFullName);
        setIsEditingPersonal(false);
    };

    const handleSaveContact = async () => {
        await supabase
            .from('users')
            .update({ phone: editData.phone, address: editData.address })
            .eq('id', user.id);

        setUser({ ...user, phone: editData.phone, address: editData.address });
        setIsEditingContact(false);
    };

    const handleSavePassword = async () => {
        setPasswordError('');
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        const { error } = await supabase
            .from('users')
            .update({ password: passwordData.newPassword })
            .eq('id', user.id);

        if (error) {
            setPasswordError('Failed to update password');
            return;
        }

        showNotification("Password updated successfully!", "success");
        setIsEditingPassword(false);
        setPasswordData({ newPassword: '', confirmPassword: '' });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Generate initials for avatar
    const getInitials = () => {
        if (!user) return '';
        const first = user.firstName ? user.firstName[0] : '';
        const last = user.lastName ? user.lastName[0] : '';
        return (first + last).toUpperCase();
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
                <p style={{ color: '#888', fontSize: '18px' }}>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
                <p style={{ color: '#888', fontSize: '18px' }}>User not found. <span style={{ color: '#0ea5e9', cursor: 'pointer' }} onClick={() => navigate('/login')}>Go to Login</span></p>
            </div>
        );
    }

    return (
        <div className="profile-page" style={{ minHeight: '100vh', background: '#f4f7fe', fontFamily: 'Inter, sans-serif' }}>
            <NavigationBar />
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />

            <div style={{
                maxWidth: '1000px', margin: '40px auto', padding: '0 24px',
                position: 'relative', zIndex: 10,
            }}>
                {/* Profile Header Banner */}
                <div style={{
                    position: 'relative', borderRadius: '24px', overflow: 'hidden',
                    marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', backgroundColor: '#fff'
                }}>
                    {/* Colorful Top Banner */}
                    <div style={{
                        height: '180px',
                        background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }} />
                        <div style={{ position: 'absolute', bottom: '-60px', left: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)' }} />
                    </div>

                    <div style={{
                        padding: '0 40px 40px', display: 'flex', alignItems: 'flex-end',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px', marginTop: '-60px' }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative' }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="User Avatar" style={{
                                        width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover',
                                        border: '6px solid #fff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }} />
                                ) : (
                                    <div style={{
                                        width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '6px solid #fff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }}>
                                        <span style={{ color: '#fff', fontSize: '48px', fontWeight: '800', letterSpacing: '2px' }}>{getInitials()}</span>
                                    </div>
                                )}
                                <label style={{
                                    position: 'absolute', bottom: '8px', right: '8px', backgroundColor: '#fff',
                                    borderRadius: '50%', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5',
                                    transition: 'transform 0.2s',
                                }} title="Change Avatar" onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Camera size={18} />
                                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            
                            {/* Name & Badge */}
                            <div style={{ paddingBottom: '8px' }}>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '15px', fontWeight: '500' }}>
                                        <Mail size={16} /> {user.email}
                                    </span>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px',
                                        backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '20px',
                                        fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px'
                                    }}>
                                        <Award size={14} /> Active Member
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button onClick={handleLogout} style={{
                            backgroundColor: '#fff', color: '#ef4444', fontWeight: '600',
                            padding: '12px 24px', borderRadius: '12px', border: '1px solid #fee2e2', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
                            transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#fee2e2'; }}>
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    
                    {/* Personal Information */}
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '24px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#0ea5e9' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <UserIcon size={22} color="#0ea5e9" /> Personal Info
                            </h2>
                            {isEditingPersonal ? (
                                <button onClick={handleSavePersonal} style={{
                                    backgroundColor: '#0ea5e9', color: '#fff', fontWeight: '600',
                                    fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}>
                                    <Check size={16} /> Save
                                </button>
                            ) : (
                                <button onClick={() => setIsEditingPersonal(true)} style={{
                                    color: '#0ea5e9', fontWeight: '600', fontSize: '13px', backgroundColor: '#f0f9ff',
                                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}>
                                    <Edit2 size={16} /> Edit
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>First Name</label>
                                <input
                                    type="text"
                                    readOnly={!isEditingPersonal}
                                    value={isEditingPersonal ? editData.firstName : user.firstName}
                                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                                    style={{
                                        width: '100%', border: isEditingPersonal ? '2px solid #38bdf8' : '2px solid transparent',
                                        borderRadius: '12px', padding: '12px 16px', color: '#1f2937', fontWeight: '500',
                                        backgroundColor: isEditingPersonal ? '#fff' : '#f3f4f6', transition: 'all 0.2s',
                                        outline: 'none', fontSize: '15px', boxSizing: 'border-box',
                                        boxShadow: isEditingPersonal ? '0 4px 12px rgba(56,189,248,0.15)' : 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Last Name</label>
                                <input
                                    type="text"
                                    readOnly={!isEditingPersonal}
                                    value={isEditingPersonal ? editData.lastName : user.lastName}
                                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                    style={{
                                        width: '100%', border: isEditingPersonal ? '2px solid #38bdf8' : '2px solid transparent',
                                        borderRadius: '12px', padding: '12px 16px', color: '#1f2937', fontWeight: '500',
                                        backgroundColor: isEditingPersonal ? '#fff' : '#f3f4f6', transition: 'all 0.2s',
                                        outline: 'none', fontSize: '15px', boxSizing: 'border-box',
                                        boxShadow: isEditingPersonal ? '0 4px 12px rgba(56,189,248,0.15)' : 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '24px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#8b5cf6' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Phone size={22} color="#8b5cf6" /> Contact Details
                            </h2>
                            {isEditingContact ? (
                                <button onClick={handleSaveContact} style={{
                                    backgroundColor: '#8b5cf6', color: '#fff', fontWeight: '600',
                                    fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}>
                                    <Check size={16} /> Save
                                </button>
                            ) : (
                                <button onClick={() => setIsEditingContact(true)} style={{
                                    color: '#8b5cf6', fontWeight: '600', fontSize: '13px', backgroundColor: '#f5f3ff',
                                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ede9fe'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5f3ff'}>
                                    <Edit2 size={16} /> Edit
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} color={isEditingContact ? '#8b5cf6' : '#9ca3af'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        readOnly={!isEditingContact}
                                        value={isEditingContact ? editData.phone : user.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        style={{
                                            width: '100%', border: isEditingContact ? '2px solid #a78bfa' : '2px solid transparent',
                                            borderRadius: '12px', padding: '12px 16px 12px 48px', color: '#1f2937', fontWeight: '500',
                                            backgroundColor: isEditingContact ? '#fff' : '#f3f4f6', transition: 'all 0.2s',
                                            outline: 'none', fontSize: '15px', boxSizing: 'border-box',
                                            boxShadow: isEditingContact ? '0 4px 12px rgba(139,92,246,0.15)' : 'none'
                                        }}
                                        placeholder="Add phone number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} color={isEditingContact ? '#8b5cf6' : '#9ca3af'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        readOnly={!isEditingContact}
                                        value={isEditingContact ? editData.address : user.address}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        style={{
                                            width: '100%', border: isEditingContact ? '2px solid #a78bfa' : '2px solid transparent',
                                            borderRadius: '12px', padding: '12px 16px 12px 48px', color: '#1f2937', fontWeight: '500',
                                            backgroundColor: isEditingContact ? '#fff' : '#f3f4f6', transition: 'all 0.2s',
                                            outline: 'none', fontSize: '15px', boxSizing: 'border-box',
                                            boxShadow: isEditingContact ? '0 4px 12px rgba(139,92,246,0.15)' : 'none'
                                        }}
                                        placeholder="Add address"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Details */}
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '24px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden',
                        gridColumn: '1 / -1' // Span full width on larger screens
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#f59e0b' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shield size={22} color="#f59e0b" /> Security
                            </h2>
                            {isEditingPassword ? (
                                <button onClick={handleSavePassword} style={{
                                    backgroundColor: '#f59e0b', color: '#fff', fontWeight: '600',
                                    fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}>
                                    <Check size={16} /> Update Password
                                </button>
                            ) : (
                                <button onClick={() => setIsEditingPassword(true)} style={{
                                    color: '#d97706', fontWeight: '600', fontSize: '13px', backgroundColor: '#fef3c7',
                                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fde68a'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}>
                                    <Lock size={16} /> Change Password
                                </button>
                            )}
                        </div>

                        {passwordError && (
                            <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={16} /> {passwordError}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>New Password</label>
                                <input
                                    type="password"
                                    readOnly={!isEditingPassword}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    style={{
                                        width: '100%', border: isEditingPassword ? '2px solid #fbbf24' : '2px solid transparent',
                                        borderRadius: '12px', padding: '12px 16px', color: '#1f2937', fontWeight: '500',
                                        backgroundColor: isEditingPassword ? '#fff' : '#f3f4f6', transition: 'all 0.2s',
                                        outline: 'none', fontSize: '15px', boxSizing: 'border-box',
                                        boxShadow: isEditingPassword ? '0 4px 12px rgba(245,158,11,0.15)' : 'none',
                                        opacity: isEditingPassword ? 1 : 0.6
                                    }}
                                    placeholder={isEditingPassword ? "Enter new password" : "••••••••"}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    readOnly={!isEditingPassword}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    style={{
                                        width: '100%', border: isEditingPassword ? '2px solid #fbbf24' : '2px solid transparent',
                                        borderRadius: '12px', padding: '12px 16px', color: '#1f2937', fontWeight: '500',
                                        backgroundColor: isEditingPassword ? '#fff' : '#f3f4f6', transition: 'all 0.2s',
                                        outline: 'none', fontSize: '15px', boxSizing: 'border-box',
                                        boxShadow: isEditingPassword ? '0 4px 12px rgba(245,158,11,0.15)' : 'none',
                                        opacity: isEditingPassword ? 1 : 0.6
                                    }}
                                    placeholder={isEditingPassword ? "Confirm new password" : "••••••••"}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
