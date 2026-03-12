import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NavigationBar from '../components/NavigationBar';

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [editData, setEditData] = useState({});

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
                avatar: null, // Will use initials by default
            };

            setUser(userData);
            setEditData(userData);
            setLoading(false);
        };

        fetchUser();
    }, [navigate]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const updatedUser = { ...user, avatar: imageUrl };
            setUser(updatedUser);
            setEditData(updatedUser);
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
        <div className="profile-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff, #dbeafe)', fontFamily: 'Inter, sans-serif' }}>
            <NavigationBar />

            <div style={{
                maxWidth: '64rem', margin: '40px auto', padding: '24px',
                backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)',
                borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.5)', position: 'relative', zIndex: 10,
            }}>
                {/* Profile Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: '1px solid #e5e7eb', paddingBottom: '24px', marginBottom: '32px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative' }}>
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="User Avatar"
                                    style={{
                                        width: '128px', height: '128px', borderRadius: '50%',
                                        objectFit: 'cover', border: '4px solid #e0f2fe',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '128px', height: '128px', borderRadius: '50%',
                                    backgroundColor: '#0ea5e9', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', border: '4px solid #e0f2fe',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                }}>
                                    <span style={{ color: '#fff', fontSize: '40px', fontWeight: '800' }}>{getInitials()}</span>
                                </div>
                            )}
                            <label style={{
                                position: 'absolute', bottom: '0', right: '0',
                                backgroundColor: '#0ea5e9', borderRadius: '50%', padding: '8px',
                                cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }} title="Change Avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="white">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                            </h1>
                            <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '15px' }}>{user.email}</p>
                            <span style={{
                                display: 'inline-block', marginTop: '8px', padding: '4px 12px',
                                backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '20px',
                                fontSize: '13px', fontWeight: '600',
                            }}>
                                Active Member
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{
                        backgroundColor: '#ef4444', color: '#fff', fontWeight: '600',
                        padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Log Out
                    </button>
                </div>

                {/* Profile Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                    {/* Personal Information */}
                    <div style={{
                        backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px',
                        border: '1px solid #e0f2fe', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', borderBottom: '2px solid #0ea5e9', paddingBottom: '4px', display: 'inline-block', margin: 0 }}>
                                Personal Information
                            </h2>
                            {isEditingPersonal ? (
                                <button onClick={handleSavePersonal} style={{
                                    backgroundColor: '#0ea5e9', color: '#fff', fontWeight: '500',
                                    fontSize: '13px', padding: '6px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                }}>Save</button>
                            ) : (
                                <button onClick={() => setIsEditingPersonal(true)} style={{
                                    color: '#0ea5e9', fontWeight: '500', fontSize: '13px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                }}>Edit</button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>First Name</label>
                                <input
                                    type="text"
                                    readOnly={!isEditingPersonal}
                                    value={isEditingPersonal ? editData.firstName : user.firstName}
                                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                                    style={{
                                        width: '100%', border: `1px solid ${isEditingPersonal ? '#7dd3fc' : '#e5e7eb'}`,
                                        borderRadius: '6px', padding: '8px 12px', color: '#374151',
                                        backgroundColor: isEditingPersonal ? '#fff' : '#f9fafb',
                                        outline: 'none', fontSize: '14px', boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>Last Name</label>
                                <input
                                    type="text"
                                    readOnly={!isEditingPersonal}
                                    value={isEditingPersonal ? editData.lastName : user.lastName}
                                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                    style={{
                                        width: '100%', border: `1px solid ${isEditingPersonal ? '#7dd3fc' : '#e5e7eb'}`,
                                        borderRadius: '6px', padding: '8px 12px', color: '#374151',
                                        backgroundColor: isEditingPersonal ? '#fff' : '#f9fafb',
                                        outline: 'none', fontSize: '14px', boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div style={{
                        backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px',
                        border: '1px solid #e0f2fe', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', borderBottom: '2px solid #0ea5e9', paddingBottom: '4px', display: 'inline-block', margin: 0 }}>
                                Contact Details
                            </h2>
                            {isEditingContact ? (
                                <button onClick={handleSaveContact} style={{
                                    backgroundColor: '#0ea5e9', color: '#fff', fontWeight: '500',
                                    fontSize: '13px', padding: '6px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                }}>Save</button>
                            ) : (
                                <button onClick={() => setIsEditingContact(true)} style={{
                                    color: '#0ea5e9', fontWeight: '500', fontSize: '13px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                }}>Edit</button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>Phone Number</label>
                                <input
                                    type="text"
                                    readOnly={!isEditingContact}
                                    value={isEditingContact ? editData.phone : user.phone}
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                    style={{
                                        width: '100%', border: `1px solid ${isEditingContact ? '#7dd3fc' : '#e5e7eb'}`,
                                        borderRadius: '6px', padding: '8px 12px', color: '#374151',
                                        backgroundColor: isEditingContact ? '#fff' : '#f9fafb',
                                        outline: 'none', fontSize: '14px', boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>Address</label>
                                <input
                                    type="text"
                                    readOnly={!isEditingContact}
                                    value={isEditingContact ? editData.address : user.address}
                                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                    style={{
                                        width: '100%', border: `1px solid ${isEditingContact ? '#7dd3fc' : '#e5e7eb'}`,
                                        borderRadius: '6px', padding: '8px 12px', color: '#374151',
                                        backgroundColor: isEditingContact ? '#fff' : '#f9fafb',
                                        outline: 'none', fontSize: '14px', boxSizing: 'border-box',
                                    }}
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
